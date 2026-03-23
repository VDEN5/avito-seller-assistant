import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Switch,
} from '@mui/material'
import { useFilterStore } from '../store/filterStore'
import { categoryLabels } from '../utils/helpers'
import { Category } from '../types'

const categories: Category[] = ['auto', 'real_estate', 'electronics']

export default function FiltersSidebar() {
  const {
    categories: selectedCategories,
    needsRevisionOnly,
    toggleCategory,
    setNeedsRevisionOnly,
    resetFilters,
  } = useFilterStore()

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Фильтры
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        Категории
      </Typography>
      <FormGroup>
        {categories.map((cat) => (
          <FormControlLabel
            key={cat}
            control={
              <Checkbox
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
            }
            label={categoryLabels[cat]}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <FormControlLabel
        control={
          <Switch
            checked={needsRevisionOnly}
            onChange={(e) => setNeedsRevisionOnly(e.target.checked)}
          />
        }
        label="Только требующие доработок"
      />

      <Divider sx={{ my: 2 }} />

      <Button variant="outlined" fullWidth onClick={resetFilters}>
        Сбросить фильтры
      </Button>
    </Box>
  )
}