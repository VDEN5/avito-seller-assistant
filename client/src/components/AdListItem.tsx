import { ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Box, Chip } from '@mui/material';
import { Item } from '../types';
import { formatPrice, categoryLabels } from '../utils/helpers';

interface AdListItemProps {
  item: Item;
  onClick: () => void;
}

export default function AdListItem({ item, onClick }: AdListItemProps) {
  return (
    <ListItem
      button
      onClick={onClick}
      sx={{
        borderBottom: '1px solid #e0e0e0',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <ListItemAvatar>
        <Avatar
          src="https://static.vecteezy.com/system/resources/thumbnails/048/910/778/small_2x/default-image-missing-placeholder-free-vector.jpg"
          variant="rounded"
          sx={{ width: 80, height: 80, mr: 2 }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">{item.title}</Typography>
            <Chip label={categoryLabels[item.category]} size="small" variant="outlined" />
          </Box>
        }
        secondary={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {formatPrice(item.price)}
            </Typography>
            {item.needsRevision && (
              <Chip
                label="Тр1ебует доработок"
                size="small"
                sx={{ backgroundColor: '#ffeb3b', color: '#000000', fontWeight: 500, width: 'fit-content' }}
              />
            )}
            <Typography variant="caption" color="text.secondary">
              {new Date(item.createdAt).toLocaleDateString('ru-RU')}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );
}