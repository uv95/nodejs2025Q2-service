import { IsNumber, IsString } from 'class-validator';
import { IsStringOrNull } from 'src/common/customDecorators/isStringOrNull';

export class CreateTrackDto {
  @IsString()
  name: string;

  @IsStringOrNull({ message: 'artistId must be null or of type string' })
  artistId: string | null;

  @IsStringOrNull({ message: 'albumId must be null or of type string' })
  albumId: string | null;

  @IsNumber()
  duration: number;
}
