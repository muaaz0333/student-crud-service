import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IStudent } from '../interface/student.interface';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { Student } from '../schema/student.schema';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel('Student') private studentModel: Model<IStudent>,
    @Inject('STUDENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async createStudent(createStudentDto: CreateStudentDto): Promise<Student> {
    const existingStudent = await this.studentModel.findOne({
      email: createStudentDto.email,
    });
    if (existingStudent) {
      throw new BadRequestException(
        'Student with this email already existsssss',
      );
    }
    const newStudent = new this.studentModel(createStudentDto);
    const student = await newStudent.save();
    const message = {
      _id: student._id,
      email: student.email,
      name: student.name,
    };
    this.client.emit('new-user', message);
    return student;
  }

  async updateStudent(
    studentId: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<IStudent> {
    const existingStudent = await this.studentModel.findByIdAndUpdate(
      studentId,
      updateStudentDto,
      { new: true },
    );
    if (!existingStudent) {
      throw new NotFoundException(`Student #${studentId} not found`);
    }
    return existingStudent;
  }

  async getAllStudents(): Promise<IStudent[]> {
    const studentData = await this.studentModel.find();
    if (!studentData || studentData.length == 0) {
      throw new NotFoundException('Students data not found!');
    }
    return studentData;
  }

  async getStudent(studentId: string): Promise<IStudent> {
    const existingStudent = await this.studentModel.findById(studentId).exec();
    if (!existingStudent) {
      throw new NotFoundException(`Student #${studentId} not found`);
    }
    return existingStudent;
  }

  async deleteStudent(studentId: string): Promise<IStudent> {
    const deletedStudent = await this.studentModel.findByIdAndDelete(studentId);
    if (!deletedStudent) {
      throw new NotFoundException(`Student #${studentId} not found`);
    }
    return deletedStudent;
  }
}
