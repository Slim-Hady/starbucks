import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import {
  CreateOrder,
  DeleteOrder,
  UpdateOrder,
  checkExistID,
  checkValidID,
  getAllOrders,
  getOrder,
} from '../../src/controller/OrderController';

import { Order } from '../../src/models/Order';
import APIFeature from '../../src/utils/APIFeature';

jest.mock('../../src/models/Order', () => ({
  Order: {
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findById: jest.fn(),
  },
}));

jest.mock('../../src/utils/APIFeature', () => jest.fn());

const mockedOrder = Order as jest.Mocked<typeof Order>;
const MockedAPIFeature = APIFeature as unknown as jest.Mock;

const createMockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Order controller', () => {
  afterEach(() => jest.clearAllMocks());

  it('gets all orders', async () => {
    const req = { query: {} } as unknown as Request;
    const res = createMockResponse();
    const orders = [{ _id: '1', totalPrice: 20 }];
    const queryStub = { find: jest.fn() };
    const featureInstance = {
      filter: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limitFields: jest.fn().mockReturnThis(),
      pagination: jest.fn().mockReturnThis(),
      query: Promise.resolve(orders),
    };

    mockedOrder.find.mockReturnValue(queryStub as any);
    MockedAPIFeature.mockImplementation(() => featureInstance);

    await getAllOrders(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'Sucess get all orders',
      result: orders.length,
      data: { orders },
    });
  });

  it('gets one order', async () => {
    const order = { _id: '1', totalPrice: 20 };
    const req = { order } as unknown as Request;
    const res = createMockResponse();

    await getOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'Success get order', data: { order } });
  });

  it('creates an order', async () => {
    const req = { body: { totalPrice: 20 } } as unknown as Request;
    const res = createMockResponse();
    const order = { _id: '1', totalPrice: 20 };

    mockedOrder.create.mockResolvedValue(order as any);

    await CreateOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ status: 'Success create order', data: { order } });
  });

  it('updates an order', async () => {
    const order = { _id: '1', totalPrice: 20 };
    const req = { order, body: { totalPrice: 25 } } as unknown as Request;
    const res = createMockResponse();

    mockedOrder.findByIdAndUpdate.mockResolvedValue({ ...order, totalPrice: 25 } as any);

    await UpdateOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'Success Update Order', data: { order } });
  });

  it('deletes an order', async () => {
    const order = { _id: '1', totalPrice: 20 };
    const req = { order } as unknown as Request;
    const res = createMockResponse();

    mockedOrder.findByIdAndDelete.mockResolvedValue(order as any);

    await DeleteOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'Success Update Order',
      message: 'Order deleted succefully',
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

  it('attaches existing order', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439011' } } as unknown as Request;
    const res = createMockResponse();
    const next = jest.fn() as NextFunction;
    const order = { _id: req.params.id, totalPrice: 20 };

    mockedOrder.findById.mockResolvedValue(order as any);

    await checkExistID(req, res, next);

    expect((req as any).order).toEqual(order);
    expect(next).toHaveBeenCalledTimes(1);
  });
});