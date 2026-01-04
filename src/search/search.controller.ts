import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('businesses')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(
    @Query('term') term?: string,
    @Query('category') category?: string,
    @Query('city') city?: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
  ) {
    return this.searchService.search({
      term,
      category,
      city,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
    });
  }
}







