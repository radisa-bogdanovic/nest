import { PartialType } from '@nestjs/mapped-types';
import { PrioritetDTO } from './prioritet.dto';

export class FindSpecificTasks extends PartialType(PrioritetDTO) {}
