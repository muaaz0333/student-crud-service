import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from '../service/student.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly studentService: StudentService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const student = await this.studentService.getStudent(email);
    if (student && bcrypt.compareSync(pass, student.password)) {
      const { password, ...result } = student;
      return result;
    }
    return null;
  }

  async login(student: any) {
    const payload = { email: student.email, sub: student.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
