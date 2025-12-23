import { StoreWithData } from "@/components/table/BaseTableList";

const getSerialNumber = <T>(store: StoreWithData<T>, index: number) => {
  return (
    (store.pagination?.current_page - 1) * store.pagination?.per_page +
    index +
    1
  );
};

export default getSerialNumber;
