import { useColorMode } from "@chakra-ui/color-mode";
import Logo from "@/components/Logo";
import ChangePasswordForm from "./Logic";

type FormProps = {};

const Form = ({}: FormProps) => {
  const { colorMode } = useColorMode();
  const isLightMode = colorMode === "light";

  return (
    <div className="w-full max-w-[31.5rem] m-auto">
      <>
        <Logo className="max-w-[11.875rem] mx-auto mb-8" dark={isLightMode} />
        <ChangePasswordForm />
      </>
    </div>
  );
};

export default Form;