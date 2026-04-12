import { NapraviTaskDto } from './napravi-task.dto';
import { PartialType } from '@nestjs/mapped-types';

export class AzurirajTaskDto extends PartialType(NapraviTaskDto) {}
