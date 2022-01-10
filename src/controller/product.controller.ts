import {
  CreateProductInput,
  DeleteProductInput,
  GetProductInput,
  UpdateProductInput,
} from "./../schema/product.schema";
import { Response, Request } from "express";
import { get } from "lodash";
import {
  createProduct,
  findProduct,
  deleteProduct,
  findAndUpdate,
} from "../service/product.service";
import logger from "../utils/logger";

export const createProductHandler = async (
  req: Request<{}, {}, CreateProductInput["body"]>,
  res: Response
) => {
  try {
    const userId = res.locals.user._id;
    const body = req.body;

    const product = await createProduct({ ...body, user: userId });

    return res.send(product);
  } catch (error) {
    logger.error(error);
  }
};

export const updateProductHandler = async (
  req: Request<UpdateProductInput["params"]>,
  res: Response
) => {
  const userId = res.locals.user._id;
  const productId = req.params.productId;
  const update = req.body;

  const product = await findProduct({ productId });

  if (!product) {
    return res.sendStatus(404);
  }

  if (String(product.user) !== userId) {
    return res.sendStatus(403);
  }

  const updatedProduct = await findAndUpdate({ productId }, update, {
    new: true,
  });

  return res.send(updatedProduct);
};

export const getProductHandler = async (
  req: Request<GetProductInput["params"]>,
  res: Response
) => {
  const productId = req.params.productId;
  const product = await findProduct({ productId });

  if (!product) {
    return res.sendStatus(404);
  }

  return res.send(product);
};

export const deleteProductHandler = async (
  req: Request<DeleteProductInput["params"]>,
  res: Response
) => {
  const userId = res.locals.user._id;
  const productId = req.params.productId;

  const product = await findProduct({ productId });

  if (!product) {
    return res.sendStatus(404);
  }

  if (String(product.user) !== userId) return res.sendStatus(401);

  await deleteProduct({ productId });

  return res.sendStatus(200);
};
