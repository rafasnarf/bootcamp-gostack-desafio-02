/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const students = await Student.findAll();

    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
      age: Yup.number()
        .integer()
        .positive()
        .required(),
      weight: Yup.number()
        .positive()
        .required(),
      height: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Faltam dados a serem preenchidos' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });
    if (studentExists) {
      return res.status(400).json({ error: 'Aluno já cadastrado' });
    }
    await Student.create(req.body);
    await Student.update(
      { hasplan: false },
      { where: { email: req.body.email } }
    );
    return res.json(req.body);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number()
        .integer()
        .positive(),
      weight: Yup.number().positive(),
      height: Yup.number().positive(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Faltam dados a serem preenchidos' });
    }

    const { email } = req.body;

    const student = await Student.findOne({ where: { email } });

    if (!student) {
      return res.status(401).json({ error: 'Aluno não cadastrado' });
    }
    const { id, name, age, weight, height } = await student.update(req.body);
    return res.json({ id, name, age, weight, height });
  }
}

export default new StudentController();
