/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import { addDays, startOfDay, parseISO } from 'date-fns';
import Registrations from '../models/Registration';

import Subscription from '../models/Subscription';
import Student from '../models/Student';

class RegistrationController {
  // eslint-disable-next-line class-methods-use-this
  async store(req, res) {
    const { subscription_id, student_id, start_date } = req.body;
    const subExists = await Subscription.findOne({
      where: { id: subscription_id },
    });
    if (!subExists) {
      return res.status(400).json({ error: 'Não existe esse tipo de plano' });
    }
    const studentExists = await Student.findOne(
      { where: { id: student_id } },
      {
        include: [
          {
            model: Student,
            as: 'student_id',
            attributes: ['name', 'email'],
          },
        ],
      }
    );
    if (!studentExists) {
      return res.status(400).json({ error: 'Aluno não cadastrado' });
    }
    const regExists = await Registrations.findOne({
      where: { student_id, subscription_id },
    });
    if (regExists) {
      return res
        .status(400)
        .json({ error: 'Aluno já possui plano, selecione alteração de plano' });
    }
    const subscriptions = await Subscription.findOne(
      { where: { id: subscription_id } },
      {
        include: [
          {
            model: Subscription,
            as: 'subscription_id',
            attributes: ['id', 'title', 'duration', 'price'],
          },
        ],
      }
    );
    const parsedDate = parseISO(start_date);
    const endDate = addDays(startOfDay(parsedDate), 30);
    const totalprice = parseFloat(subscriptions.price * subscriptions.duration);
    const registration = await Registrations.create({
      start_date: parsedDate,
      end_date: endDate,
      totalprice,
      student_id,
      subscription_id,
    });
    return res.json(registration);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const registrations = await Registrations.findAll({
      order: ['id'],
      attributes: ['id', 'start_date', 'end_date', 'totalprice'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Subscription,
          as: 'subscription',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(registrations);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      totalprice: Yup.date(),
      end_date: Yup.date(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Faltam dados a serem preenchidos' });
    }
    const { id } = req.body;

    const regExists = Registrations.findOne({ where: { id } });

    if (!regExists) {
      return res.status(401).json({ error: 'Matrícula não cadastrado' });
    }

    const { id, student_id, subscription_id, start_date, totalprice_ end_date } = await Registrations.update(req.body);

    return res.json({ id, student_id, subscription_id, start_date, totalprice_ end_date })

  }

  async delete(req, res) {
    const checkReg = Registrations.findOne({
      where: {
        req.params.id
      }
    });
    if (!checkReg) {
      return res.status(400).json({ error: 'Este matricula não existe' });
    }
    Registrations.destroy({ where: { id: req.params.id } });
    return res.json({ message: 'Plano removido do sistema' });
  }
}
export default new RegistrationController();
