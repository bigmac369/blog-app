import { NextFunction, Request, Response } from "express";

interface CustomError extends Error {
  statusCode?: number;
  code?: number; // For MongoDB/Mongoose error codes (like 11000)
  //   name?: string; // For error names (like "CastError", "ValidationError")
  errors?: Record<string, { message: string }>; // For validation errors
  keyValue?: Record<string, unknown>; // For duplicate key errors
  message: string; // From base Error class
}

const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let error = { ...err }; //Destructure the error object that we getting through props
    error.message = err.message; //Get the message from the error object
    console.error(err);

    //Mongoose bad ObjectId
    if (err.name === "CastError") {
      const message = "Resource not found.";
      error = new Error(message);
      error.statusCode = 404;
    }

    //Mongoose duplicate key
    if (err.code === 11000) {
      const message = "Duplicate field value entered";
      error = new Error(message);
      error.statusCode = 400;
    }

    //Mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors ?? {}).map(
        //if no error will return empty object, using Object.values to empty object return an empty array which map execute zero times and return an empty array
        (val) => (val as { message: string }).message
      );
      //Object.values will return the values of an object in an array
      //map will iterate through the array and return the message of each value
      error = new Error(message.join(", ")); //Join the array into a string
      error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
