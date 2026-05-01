import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import {
  CreateProduct,
  DeleteProduct,
  UpdateProduct,
  checkExistID,
  checkValidID,
  getAllProducts,
  getProduct,
} from '../../src/controller/ProductController';

import { Product } from '../../src/models/Product';
import APIFeature from '../../src/utils/APIFeature';

jest.mock('../../src/models/Product', () => ({
  Product: {
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findById: jest.fn(),
  },
}));

jest.mock('../../src/utils/APIFeature', () => jest.fn());

const mockedProduct = Product as jest.Mocked<typeof Product>;
const MockedAPIFeature = APIFeature as unknown as jest.Mock;

const createMockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Product controller', () => {
  afterEach(() => jest.clearAllMocks());

  it('gets all products', async () => {
    const req = { query: {} } as unknown as Request;
    const res = createMockResponse();
    const products = [{ _id: '1', name: 'Latte' }];
    const queryStub = { find: jest.fn() };
    const featureInstance = {
      filter: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limitFields: jest.fn().mockReturnThis(),
      pagination: jest.fn().mockReturnThis(),
      query: Promise.resolve(products),
    };

    mockedProduct.find.mockReturnValue(queryStub as any);
    MockedAPIFeature.mockImplementation(() => featureInstance);

    await getAllProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'Sucess get all products',
      result: products.length,
      data: { products },
    });
  });

  it('gets one product', async () => {
    const product = { _id: '1', name: 'Latte' };
    const req = { product } as unknown as Request;
    const res = createMockResponse();

    await getProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'Success get product', data: { product } });
  });

  it('creates a product', async () => {
    const req = { body: { name: 'Latte' } } as unknown as Request;
    const res = createMockResponse();
    const product = { _id: '1', name: 'Latte' };

    mockedProduct.create.mockResolvedValue(product as any);

    await CreateProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ status: 'Success create product', data: { product } });
  });

  it('updates a product', async () => {
    const product = { _id: '1', name: 'Latte' };
    const req = { product, body: { name: 'Mocha' } } as unknown as Request;
    const res = createMockResponse();

    mockedProduct.findByIdAndUpdate.mockResolvedValue({ ...product, name: 'Mocha' } as any);

    await UpdateProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'Success Update Product', data: { product } });
  });

  it('deletes a product', async () => {
    const product = { _id: '1', name: 'Latte' };
    const req = { product } as unknown as Request;
    const res = createMockResponse();

    mockedProduct.findByIdAndDelete.mockResolvedValue(product as any);

    await DeleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'Success Update Product',
      message: 'Product deleted succefully',
    });
  });

  it('rejects invalid ids', () => {
    const req = {} as unknown as Request;
    const res = createMockResponse();
    const next = jest.fn() as NextFunction;

    checkValidID(req, res, next, 'bad-id');

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('accepts valid ids', () => {
    const req = {} as unknown as Request;
    const res = createMockResponse();
    const next = jest.fn() as NextFunction;

    checkValidID(req, res, next, new mongoose.Types.ObjectId().toString());

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('attaches existing product', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439011' } } as unknown as Request;
    const res = createMockResponse();
    const next = jest.fn() as NextFunction;
    const product = { _id: req.params.id, name: 'Latte' };

    mockedProduct.findById.mockResolvedValue(product as any);

    await checkExistID(req, res, next);

    expect((req as any).product).toEqual(product);
    expect(next).toHaveBeenCalledTimes(1);
  });
});