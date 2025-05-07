import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from '../service/student.service';
import { HttpStatus } from '@nestjs/common';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';

const mockStudent = {
  _id: '66d05502ca803cacdfc61a4c',
  name: 'Muaaz Ahmad',
  rollNumber: 173,
  class: 16,
  gender: 'Male',
  marks: 100,
  email: 'muaazahmad001@gmail.com',
  password: 123456,
};

describe('StudentController', () => {
  let controller: StudentController;
  let service: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: StudentService,
          useValue: {
            createStudent: jest.fn().mockResolvedValue(mockStudent),
            updateStudent: jest.fn().mockResolvedValue(mockStudent),
            getAllStudents: jest.fn().mockResolvedValue([mockStudent]),
            getStudent: jest.fn().mockResolvedValue(mockStudent),
            deleteStudent: jest.fn().mockResolvedValue(mockStudent),
          },
        },
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createStudent', () => {
    it('should create a student and return the response', async () => {
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const createStudentDto: CreateStudentDto = mockStudent;
      await controller.createStudent(response, createStudentDto);

      expect(service.createStudent).toHaveBeenCalledWith(createStudentDto);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Student has been created successfully, and email sent',
        newStudent: mockStudent,
      });
    });

    it('should return an error response if student creation fails', async () => {
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest
        .spyOn(service, 'createStudent')
        .mockRejectedValueOnce(new Error('Error: Student not created!'));

      const createStudentDto: CreateStudentDto = mockStudent;
      await controller.createStudent(response, createStudentDto);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: 400,
        message: 'Error: Student not created!',
        error: 'Bad Request',
      });
    });
  });

  describe('updateStudent', () => {
    it('should update a student and return the response', async () => {
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const updateStudentDto: UpdateStudentDto = mockStudent;
      await controller.updateStudent(response, '1', updateStudentDto);

      expect(service.updateStudent).toHaveBeenCalledWith('1', updateStudentDto);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Student has been successfully updated',
        existingStudent: mockStudent,
      });
    });

    it('should return an error response if student update fails', async () => {
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest
        .spyOn(service, 'updateStudent')
        .mockRejectedValueOnce(new Error('Student #1 not found'));

      const updateStudentDto: UpdateStudentDto = mockStudent;
      await controller.updateStudent(response, '1', updateStudentDto);

      expect(response.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(response.json).toHaveBeenCalledWith({
        message: 'Student #1 not found',
      });
    });
  });

  describe('getStudents', () => {
    it('should get all students and return the response', async () => {
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getStudents(response);

      expect(service.getAllStudents).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith({
        message: 'All students data found successfully',
        studentData: [mockStudent],
      });
    });

    it('should return an error response if no students are found', async () => {
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(service, 'getAllStudents').mockRejectedValueOnce({
        status: HttpStatus.NOT_FOUND,
        response: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Students data not found!',
        },
      });

      await controller.getStudents(response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Students data not found!',
      });
    });
  });

  describe('getStudent', () => {
    it('should get a student by id and return the response', async () => {
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getStudent(response, '1');

      expect(service.getStudent).toHaveBeenCalledWith('1');
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Student found successfully',
        existingStudent: mockStudent,
      });
    });

    it('should return an error response if student is not found', async () => {
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(service, 'getStudent').mockRejectedValueOnce({
        status: HttpStatus.NOT_FOUND,
        response: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Student #1 not found',
        },
      });

      await controller.getStudent(response, '1');

      expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Student #1 not found',
      });
    });
  });

  describe('deleteStudent', () => {
    it('should delete a student by id and return the response', async () => {
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.deleteStudent(response, '1');

      expect(service.deleteStudent).toHaveBeenCalledWith('1');
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Student deleted successfully',
        deletedStudent: mockStudent,
      });
    });

    it('should return an error response if student deletion fails', async () => {
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(service, 'deleteStudent').mockRejectedValueOnce({
        status: HttpStatus.NOT_FOUND,
        response: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Student #1 not found',
        },
      });

      await controller.deleteStudent(response, '1');

      expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(response.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Student #1 not found',
      });
    });
  });
});
