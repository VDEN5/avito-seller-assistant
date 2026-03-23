import { Pagination as MuiPagination, Stack } from '@mui/material'

interface PaginationProps {
  page: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, total, limit, onPageChange }: PaginationProps) {
  const pageCount = Math.ceil(total / limit)

  if (pageCount <= 1) return null

  return (
    <Stack alignItems="center" sx={{ mt: 3 }}>
      <MuiPagination
        count={pageCount}
        page={page}
        onChange={(_, value) => onPageChange(value)}
        color="primary"
        showFirstButton
        showLastButton
      />
    </Stack>
  )
}