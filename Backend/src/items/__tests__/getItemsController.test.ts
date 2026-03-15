import { test, describe, beforeEach, jest, expect } from "@jest/globals";
import { Request, Response } from "express";
import { getItemsController } from "../getItemsController";
import Item, { IItem } from "../../models/Item";

jest.mock("../../models/Item");

describe("get items controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {
      query: {},
    };

    mockResponse = {
      status: statusMock as any,
      json: jsonMock as any,
    };

    (Item.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: (jest.fn() as any).mockResolvedValue([]),
        }),
      }),
      countDocuments: (jest.fn() as any).mockResolvedValue(0),
    });
  });

  test("should return items with default pagination", async () => {
    mockRequest.query = {};
    await getItemsController(mockRequest as Request, mockResponse as Response);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      data: {
        items: [],
      },
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        hasMore: false,
      },
    });
  });

  test("should return error when page is not valid number", async () => {
    mockRequest.query = {
      page: "abc",
    };

    await getItemsController(mockRequest as Request, mockResponse as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Page must be a valid number",
    });
  });

  test("should return 400 when limit is not valid", async () => {
    mockRequest.query = {
      limit: "abc",
    };

    await getItemsController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Limit must be a valid number",
    });
  });

  test("should return 400 when page is less than 1", async () => {
    mockRequest.query = {
      page: "0",
    };
    await getItemsController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Page must be at least 1",
    });
  });
});
