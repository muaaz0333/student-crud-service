import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IStudent } from '../interface/student.interface';
import { NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const mockStudent = {
  _id: '66d05502ca803cacdfc61a4c',
  name: 'Muaaz Ahmad',
  rollNumber: 173,
  class: 16,
  gender: 'Male',
  marks: 100,
  email: 'muaazahmad001@gmail.com',
};

const mockStudentModel = {
  save: jest.fn().mockResolvedValue(mockStudent),
  findByIdAndUpdate: jest.fn().mockResolvedValue(mockStudent),
  find: jest.fn().mockResolvedValue([mockStudent]),
  findById: jest.fn().mockResolvedValue(mockStudent),
  findByIdAndDelete: jest.fn().mockResolvedValue(mockStudent),
};

const mockClientProxy = {
  emit: jest.fn(),
};

describe('StudentService', () => {
  let service: StudentService;
  let model: Model<IStudent>;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getModelToken('Student'),
          useValue: mockStudentModel,
        },
        {
          provide: 'STUDENT_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    model = module.get<Model<IStudent>>(getModelToken('Student'));
    client = module.get<ClientProxy>('STUDENT_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createStudent', () => {
    it('should create a student and emit a message', async () => {
      const newStudent = await service.createStudent(mockStudent);
      expect(newStudent).toEqual(mockStudent);
      expect(client.emit).toHaveBeenCalledWith('new-user', {
        _id: mockStudent._id,
        email: mockStudent.email,
      });
    });
  });

  describe('updateStudent', () => {
    it('should update a student by id', async () => {
      const updatedStudent = await service.updateStudent('1', mockStudent);
      expect(updatedStudent).toEqual(mockStudent);
    });

    it('should throw NotFoundException if student is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(null);
      await expect(service.updateStudent('1', mockStudent)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllStudents', () => {
    it('should get all students', async () => {
      const students = await service.getAllStudents();
      expect(students).toEqual([mockStudent]);
    });

    it('should throw NotFoundException if no students are found', async () => {
      jest.spyOn(model, 'find').mockResolvedValueOnce([]);
      await expect(service.getAllStudents()).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStudent', () => {
    it('should get a student by id', async () => {
      const student = await service.getStudent('1');
      expect(student).toEqual(mockStudent);
    });

    it('should throw NotFoundException if student is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(null);
      await expect(service.getStudent('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteStudent', () => {
    it('should delete a student by id', async () => {
      const deletedStudent = await service.deleteStudent('1');
      expect(deletedStudent).toEqual(mockStudent);
    });

    it('should throw NotFoundException if student is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValueOnce(null);
      await expect(service.deleteStudent('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
