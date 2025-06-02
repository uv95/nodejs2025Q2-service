import { BaseService } from 'src/common/baseService';

export function removeReference<T extends { id: string }>(
  service: BaseService<T>,
  deletedId: string,
  refField: string,
) {
  const relatedRecords = service
    .getAll()
    .filter((record) => record[refField] === deletedId);

  if (relatedRecords.length) {
    relatedRecords.forEach((record) => {
      const { id: recordId, ...dataForUpdate } = record;
      service.update(recordId, {
        ...dataForUpdate,
        [refField]: null,
      });
    });
  }
}
