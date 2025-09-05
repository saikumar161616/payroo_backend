import employeeService from "../modules/employee/employee.service";
import { EmployeeModel } from "../modules/employee/employee.model";
import EMPLOYEE_CONSTANTS from "../modules/employee/employee.constants";
import HTTP_STATUS from "../constants/http.constants";
import { CustomError } from "../error-handlers/custom.error";

// Mock the dependencies
jest.mock("../modules/employee/employee.model");

const mockSession = {
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  endSession: jest.fn()
};

(EmployeeModel as any).startSession = jest.fn(() => mockSession);

describe("EmployeeService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createNewEmployee", () => {
    it('should throw error if employee data is not provided', async () => {
      await expect(employeeService.createNewEmployee(undefined)).rejects.toThrow(new CustomError('Employee data is required', HTTP_STATUS.BAD_REQUEST));
    });
    it('should throw error if employee already exists', async () => {
      (EmployeeModel.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' });
      await expect(employeeService.createNewEmployee({ email: 'test@example.com' })).rejects.toThrow(new CustomError('Employee with this email already exists', HTTP_STATUS.CONFLICT));
    });
    it('should create and return a new employee successfully', async () => {
      (EmployeeModel.findOne as jest.Mock).mockResolvedValue(null);
      const mockSave = jest.fn().mockResolvedValue({
        toObject: () => ({
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          type: 'HOURLY',
          status: 'ACTIVE',
          bank: {},
          baseHourlyRate: 20,
          superRate: 5
        })
      });
      (EmployeeModel as any).mockImplementation(() => ({ save: mockSave }));
      const result = await employeeService.createNewEmployee({ email: 'john.doe@example.com' });
      expect(result.status).toBe(true);
      expect(result.message).toBe(EMPLOYEE_CONSTANTS.EMPLOYEE_CREATED);
      expect(result.data).toHaveProperty('id', '1');
      expect(mockSession.commitTransaction).toHaveBeenCalled();
      expect(mockSession.endSession).toHaveBeenCalled();
    });

  });

  describe("updateEmployee", () => {
    it('should throw error if employeeId is missing', async () => {
      await expect(employeeService.updateEmployee('', { firstName: 'Jane' })).rejects.toThrow(new CustomError('Employee ID is required', HTTP_STATUS.BAD_REQUEST));
    });
    it('should throw error if update data is not provided', async () => {
      await expect(employeeService.updateEmployee('1', undefined)).rejects.toThrow(new CustomError('Employee data is required', HTTP_STATUS.BAD_REQUEST));
    });
    it('should throw error if employee does not exist', async () => {
      (EmployeeModel.findById as jest.Mock).mockResolvedValue(null);
      await expect(employeeService.updateEmployee('1', { firstName: 'Jane' })).rejects.toThrow(new CustomError('Employee not found', HTTP_STATUS.NOT_FOUND));
    });
  });

  describe("getAllEmployees", () => {
    it('should return all employees', async () => {
      (EmployeeModel.find as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce([
          { id: '1', firstName: 'John', status: 'active' },
        ])
      });
    });
  });

  describe('generateToken', () => {
    it('should return token', async () => {
      employeeService.jwtTokenGenerator = jest.fn().mockResolvedValue('token123');
      const result = await employeeService.generateToken({ name: 'John Doe' });
      expect(result.status).toBe(true);
      expect(result.data).toBe('token123');
    });
  });

});