'use client';

import { Skeleton, Box } from '@mui/material';

export default function ContentLoader({ lines = 3, height = 140 }) {
  return (
    <Box>
      <Skeleton
        variant="rectangular"
        height={height}
        sx={{ borderRadius: 2, mb: 2 }}
        animation="wave"
      />
      {Array.from({ length: lines }).map((_, idx) => (
        <Skeleton key={idx} width={`${80 - idx * 10}%`} animation="wave" />
      ))}
    </Box>
  );
}
