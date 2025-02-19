import { styled, TextField, TextFieldProps, Theme, useTheme } from "@mui/material";
import React, { forwardRef } from "react";

export const ThemedTextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  const theme = useTheme();
  const CustomBorderTextField = getCustomBorderTextField(theme);

  return (
    <CustomBorderTextField
      ref={ref} // Forward ref to the actual TextField
      InputLabelProps={{
        style: {
          color: theme.palette.primary.contrastText
        }
      }}
      {...props}
    />
  );
});

const getCustomBorderTextField = (theme: Theme) => styled(TextField)`
    & label.Mui-focused {
      color: ${theme.palette.primary.contrastText};
    }
    & .MuiOutlinedInput-root {
      &.Mui-focused fieldset {
        border-color: ${theme.palette.primary.contrastText};
      }
    }
    & .MuiFilledInput-root": {
      background: ${theme.palette.primary.main}
    }
`;
