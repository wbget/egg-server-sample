import { Model } from 'sequelize';

interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}
interface Paranoid {
  deletedAt: Date;
}

export { Timestamps, Paranoid, Model };
