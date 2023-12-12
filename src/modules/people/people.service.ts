import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { People } from 'src/modules/people/people.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
  ) {}
  insertPeople(peopleData: People): Promise<People> {
    try {
      let newPeople = new People();
      newPeople = { ...peopleData };
      return this.peopleRepository.save(newPeople);
    } catch (error) {
      throw error;
    }
  }
  async findPeopleById(id: string) {
    return await this.peopleRepository.findOneBy({ id });
  }
}
