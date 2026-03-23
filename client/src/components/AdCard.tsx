import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { Item } from '../types';
import { formatPrice, categoryLabels } from '../utils/helpers';

interface AdCardProps {
  item: Item;
  onClick: () => void;
}

export default function AdCard({ item, onClick }: AdCardProps) {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
        borderRadius: '20px',
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        height="100"
        image="https://static.vecteezy.com/system/resources/thumbnails/048/910/778/small_2x/default-image-missing-placeholder-free-vector.jpg"
        alt={item.title}
        sx={{ objectFit: 'cover'}}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ mb: 1 }}>
          <Chip
            label={categoryLabels[item.category]}
            size="small"
            variant="outlined"
            sx={{ borderColor: '#cccccc' }}
          />
        </Box>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {item.title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          {formatPrice(item.price)}
        </Typography>
        {item.needsRevision && (
          <Chip
            label="Требует доработок"
            size="small"
            sx={{ backgroundColor: '#ffeb3b', color: '#000000', fontWeight: 500 }}
          />
        )}
      </CardContent>
    </Card>
  );
}