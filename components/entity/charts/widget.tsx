import { DataTable } from "../widgets/table";
import Text from "../widgets/text";

const Widget = ({ type, selected }: { type: string; selected: boolean }) => {
  switch (type) {
    case "TEXT":
      return <Text selected={selected} />;
    case "TABLE":
      return <DataTable selected={selected} />;
  }
};

export default Widget;
