import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import ProductModel, { ProductDocument } from "../model/product.model";

export const createProduct = async (
  input: DocumentDefinition<Omit<ProductDocument, "createdAt" | "updateAt">>
) => {
  return ProductModel.create(input);
};

export const findProduct = async (
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true }
) => {
  return ProductModel.findOne(query, {}, options);
};

export const findAndUpdate = async (
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options: QueryOptions
) => {
  return ProductModel.findOneAndUpdate(query, update, options);
};

export const deleteProduct = async (query: FilterQuery<ProductDocument>) =>
  ProductModel.deleteOne(query);
