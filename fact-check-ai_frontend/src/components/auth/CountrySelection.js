import React from "react";
import {
  Sheet,
  Typography,
  FormControl,
  FormLabel,
  Button,
  Box,
  FormHelperText,
  Alert,
  Autocomplete,
  AutocompleteOption,
} from "@mui/joy";
import { Globe, ChevronLeft, ArrowRight } from "lucide-react";
import useAuthContext from "../../context/auth/authContext";
import { useColorScheme } from "@mui/joy";
const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "CN", name: "China" },
];

export default function CountryStep({ onNext, onBack }) {
  const { country, addCountry } = useAuthContext();
  const {mode} = useColorScheme()

  const handleAddCountry = (event, value) => {
    addCountry(value?.code || null);
  };

  return (
    <Sheet
      variant="outlined"
      sx={{ width: "100%", maxWidth: "400px", p: 4, position: "relative" }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Globe size={24} color="#3a70fc" />
        <Typography level="h4" sx={{ ml: 1 }}>
          Where are you from?
        </Typography>
      </Box>
      <Typography level="body-sm" sx={{ mb: 3, color: "neutral.500" }}>
        Choose your country for a localized experience
      </Typography>

      <Alert variant="soft" sx={{ mb: 3, backgroundColor:'neutral.200' }}>
        <Typography level="body-sm" sx={{color:'neutral.600'}}>
          Data sharing is optional—used exclusively for content customization.
        </Typography>
      </Alert>

      <FormControl sx={{ mb: 3 }}>
        <FormLabel>Country</FormLabel>
        <Autocomplete
          placeholder="Select your country"
          options={countries}
          value={countries.find((c) => c.code === country) || null}
          onChange={handleAddCountry}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.code === value.code}
          renderOption={(props, option) => (
            <AutocompleteOption {...props}>
              <img
                src={`https://flagcdn.com/16x12/${option.code.toLowerCase()}.png`}
                srcSet={`https://flagcdn.com/32x24/${option.code.toLowerCase()}.png 2x, https://flagcdn.com/48x36/${option.code.toLowerCase()}.png 3x`}
                width="16"
                height="12"
                alt={option.name}
                style={{ marginRight: 8 }}
              />
              {option.name}
            </AutocompleteOption>
          )}
          startDecorator={
            country ? (
              <img
                src={`https://flagcdn.com/16x12/${country.toLowerCase()}.png`}
                width="16"
                height="12"
                alt={countries.find((c) => c.code === country)?.name || ""}
              />
            ) : (
              <Globe size={16} />
            )
          }
        />
        <FormHelperText sx={{ color: mode === 'dark' ? 'neutral.250' : "neutral.500" }}>
          This step is <b>OPTIONAL</b>
        </FormHelperText>
      </FormControl>

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          color="neutral"
          startDecorator={<ChevronLeft size={18} />}
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          fullWidth
          endDecorator={<ArrowRight size={18} />}
          onClick={onNext}
        >
          {country ? "Continue" : "Skip"}
        </Button>
      </Box>
    </Sheet>
  );
}