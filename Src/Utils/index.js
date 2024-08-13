import { Alert, Dimensions, Linking, Platform } from "react-native";
import { moderateScale } from "../../Src/Components/SizeMatters";


const IsDevice = () => {
  if (Dimensions.relativeWidth(100) < 513) {
    return true;
  } else {
    return false;
  }
};

const isNetworkConnected = () => {
  return new Promise((resolve) => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      resolve(state.isConnected);
    });
    unsubscribe();
  });
};

export function normalize(size) {
  return moderateScale(size);
}


export {
  Color,
  IsDevice,
};
