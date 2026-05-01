import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import {
  CreateCategory,
  DeleteCategory,
  UpdateCategory,
  checkExistID,
  checkValidID,
  getAllCategories,
  getCategory,
} from '../../src/controller/CategoryController';

import { Category } from '../../src/models/Category';
import APIFeature from '../../src/utils/APIFeature';

jest.mock('../../src/models/Category', () => ({
  Category: {
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findById: jest.fn(),
  },
}));

jest.mock('../../src/utils/APIFeature', () => jest.fn());

const mockedCategory = Category as jest.Mocked<typeof Category>;
const MockedAPIFeature = APIFeature as unknown as jest.Mock;

const createMockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Category controller', () => {
  afterEach(() => jest.clearAllMocks());

  it('gets all categories', async () => {
    const req = { query: {} } as unknown as Request;
    const res = createMockResponse();
    const categories = [{ _id: '1', name: 'Coffee' }];
    const queryStub = { find: jest.fn() };
    const featureInstance = {
      filter: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limitFields: jest.fn().mockReturnThis(),
      pagination: jest.fn().mockReturnThis(),
      query: Promise.resolve(categories),
    };

    mockedCategory.find.mockReturnValue(queryStub as any);
    MockedAPIFeature.mockImplementation(() => featureInstance);

    await getAllCategories(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'Sucess get all categories',
      result: categories.length,
      data: { categories },
    });
  });

  it('gets one category', async () => {
    const category = { _id: '1', name: 'Coffee' };
    const req = { category } as unknown as Request;
    const res = createMockResponse();

    await getCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'Success get category', data: { category } });
  });

  it('creates a category', async () => {
    const req = { body: { name: 'Coffee' } } as unknown as Request;
    const res = createMockResponse();
    const category = { _id: '1', name: 'Coffee' };

    mockedCategory.create.mockResolvedValue(category as any);

    await CreateCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ status: 'Success create category', data: { category } });
  });

  it('updates a category', async () => {
    const category = { _id: '1', name: 'Coffee' };
    const req = { category, body: { name: 'Tea' } } as unknown as Request;
    const res = createMockResponse();

    mockedCategory.findByIdAndUpdate.mockResolvedValue({ ...category, name: 'Tea' } as any);

    await UpdateCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'Success Update Category', data: { category } });
  });

  it('deletes a category', async () => {
    const category = { _id: '1', name: 'Coffee' };
    const req = { category } as unknown as Request;
    const res = createMockResponse();

    mockedCategory.findByIdAndDelete.mockResolvedValue(category as any);

    await DeleteCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'Success Update Category',
      message: 'Category deleted succefully',
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

  it('attaches existing category', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439011' } } as unknown as Request;
    const res = createMockResponse();
    const next = jest.fn() as NextFunction;
    const category = { _id: req.params.id, name: 'Coffee' };

    mockedCategory.findById.mockResolvedValue(category as any);

    await checkExistID(req, res, next);

    expect((req as any).category).toEqual(category);
    expect(next).toHaveBeenCalledTimes(1);
  });
});