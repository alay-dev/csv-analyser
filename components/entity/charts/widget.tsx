import { DataTable } from "../widgets/table";
import Text from "../widgets/text";

const Widget = ({ type, id, selected }: { type: string; id: string; selected: boolean }) => {
  switch (type) {
    case "text":
      return <Text elementID={id} selected={selected} />;
    case "table":
      return <DataTable selected={selected} />;
  }
};

export default Widget;
