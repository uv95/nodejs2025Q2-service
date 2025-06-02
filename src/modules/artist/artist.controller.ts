import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  create(@Body() dto: CreateArtistDto) {
    return this.artistService.create(dto);
  }

  @Get()
  getAll() {
    return this.artistService.getAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.artistService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateArtistDto) {
    return this.artistService.update(id, dto);
  }

  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.artistService.delete(id);
  }
}
