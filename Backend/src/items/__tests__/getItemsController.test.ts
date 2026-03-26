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

  test("should handle custom page paramter and calculate correct offset", async () => {
    const skipMock = jest.fn().mockReturnValue({
      limit: (jest.fn() as any).mockResolvedValue([]),
    });

    const sortMock = jest.fn().mockReturnValue({
      skip: skipMock,
    });

    const findMock = jest.fn().mockReturnValue({
      sort: sortMock,
      countDocuments: (jest.fn() as any).mockResolvedValue(100),
    });

    (Item.find as jest.Mock) = findMock;

    mockRequest.query = {
      page: "2",
    };

    await getItemsController(mockRequest as Request, mockResponse as Response);

    expect(skipMock).toHaveBeenCalledWith(25);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      data: {
        items: [],
      },
      pagination: {
        currentPage: 2,
        totalPages: 4,
        totalItems: 100,
        hasMore: true,
      },
    });
  });

  test("should return 400 when limit is below minimum (less than 10)", async () => {
    mockRequest.query = {
      limit: "5",
    };

    await getItemsController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Limit must be between 10-100",
    });
  });

  test("should return 400 when limit is above maximum (greater than 100)", async () => {
    mockRequest.query = {
      limit: "150",
    };

    await getItemsController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Limit must be between 10-100",
    });
  });

  test("should handle custom limit parameter", async () => {
    const limitMock = (jest.fn() as any).mockResolvedValue([]);
    const skipMock = jest.fn().mockReturnValue({
      limit: limitMock,
    });

    const sortMock = jest.fn().mockReturnValue({
      skip: skipMock,
    });

    const findMock = jest.fn().mockReturnValue({
      sort: sortMock,
      countDocuments: (jest.fn() as any).mockResolvedValue(100),
    });

    (Item.find as jest.Mock) = findMock;

    mockRequest.query = {
      limit: "50",
    };

    await getItemsController(mockRequest as Request, mockResponse as Response);

    expect(limitMock).toHaveBeenCalledWith(50);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      data: {
        items: [],
      },
      pagination: {
        currentPage: 1,
        totalPages: 2,
        totalItems: 100,
        hasMore: true,
      },
    });
  });

  test("should return items from database", async () => {
    const mockItems = [
      { _id: "1", name: "Item 1", price: 10 },
      { _id: "2", name: "Item 2", price: 20 },
    ];

    (Item.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: (jest.fn() as any).mockResolvedValue(mockItems),
        }),
      }),
      countDocuments: (jest.fn() as any).mockResolvedValue(2),
    });

    mockRequest.query = {};

    await getItemsController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      data: {
        items: mockItems,
      },
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 2,
        hasMore: false,
      },
    });
  });

  test("should calculate pagination metadata correctly", async () => {
    (Item.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: (jest.fn() as any).mockResolvedValue([]),
        }),
      }),
      countDocuments: (jest.fn() as any).mockResolvedValue(75),
    });

    mockRequest.query = {
      page: "2",
      limit: "25",
    };

    await getItemsController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      data: {
        items: [],
      },
      pagination: {
        currentPage: 2,
        totalPages: 3,
        totalItems: 75,
        hasMore: true,
      },
    });
  });

  test("should set hasMore to false when on last page", async () => {
    (Item.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: (jest.fn() as any).mockResolvedValue([]),
        }),
      }),
      countDocuments: (jest.fn() as any).mockResolvedValue(75),
    });

    mockRequest.query = {
      page: "3",
      limit: "25",
    };

    await getItemsController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      data: {
        items: [],
      },
      pagination: {
        currentPage: 3,
        totalPages: 3,
        totalItems: 75,
        hasMore: false,
      },
    });
  });

  test("should accept limit at minimum boundary (10)", async () => {
    const limitMock = (jest.fn() as any).mockResolvedValue([]);
    const skipMock = jest.fn().mockReturnValue({
      limit: limitMock,
    });

    const sortMock = jest.fn().mockReturnValue({
      skip: skipMock,
    });

    const findMock = jest.fn().mockReturnValue({
      sort: sortMock,
      countDocuments: (jest.fn() as any).mockResolvedValue(50),
    });

    (Item.find as jest.Mock) = findMock;

    mockRequest.query = {
      limit: "10",
    };

    await getItemsController(mockRequest as Request, mockResponse as Response);

    expect(limitMock).toHaveBeenCalledWith(10);
    expect(statusMock).toHaveBeenCalledWith(200);
  });

  test("should accept limit at maximum boundary (100)", async () => {
    const limitMock = (jest.fn() as any).mockResolvedValue([]);
    const skipMock = jest.fn().mockReturnValue({
      limit: limitMock,
    });

    const sortMock = jest.fn().mockReturnValue({
      skip: skipMock,
    });

    const findMock = jest.fn().mockReturnValue({
      sort: sortMock,
      countDocuments: (jest.fn() as any).mockResolvedValue(50),
    });

    (Item.find as jest.Mock) = findMock;

    mockRequest.query = {
      limit: "100",
    };

    await getItemsController(mockRequest as Request, mockResponse as Response);

    expect(limitMock).toHaveBeenCalledWith(100);
    expect(statusMock).toHaveBeenCalledWith(200);
  });

  test("should return 500 when database query fails", async () => {
    (Item.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: (jest.fn() as any).mockRejectedValue(
            new Error("Database error"),
          ),
        }),
      }),
    });

    mockRequest.query = {};

    await getItemsController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: "Failed to fetch items from database",
    });
  });

  test("should return 500 when countDocuments fails", async () => {
    (Item.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: (jest.fn() as any).mockResolvedValue([]),
        }),
      }),
      countDocuments: (jest.fn() as any).mockRejectedValue(
        new Error("Count documents error"),
      ),
    });

    mockRequest.query = {};

    await getItemsController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: "Failed to fetch items from database",
    });
  });

  test("should handle both custom page and limit parameters", async () => {
    const limitMock = (jest.fn() as any).mockResolvedValue([]);
    const skipMock = jest.fn().mockReturnValue({
      limit: limitMock,
    });

    const sortMock = jest.fn().mockReturnValue({
      skip: skipMock,
    });

    const findMock = jest.fn().mockReturnValue({
      sort: sortMock,
      countDocuments: (jest.fn() as any).mockResolvedValue(150),
    });

    (Item.find as jest.Mock) = findMock;

    mockRequest.query = {
      page: "3",
      limit: "50",
    };

    await getItemsController(mockRequest as Request, mockResponse as Response);

    expect(skipMock).toHaveBeenCalledWith(100); // (3-1) * 50 = 100
    expect(limitMock).toHaveBeenCalledWith(50);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      data: {
        items: [],
      },
      pagination: {
        currentPage: 3,
        totalPages: 3,
        totalItems: 150,
        hasMore: false,
      },
    });
  });
});
