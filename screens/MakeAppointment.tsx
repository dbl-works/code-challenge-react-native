import { FontAwesome } from "@expo/vector-icons";
import { Box, Button } from 'native-base';

import { RootTabScreenProps } from '../types';

export default function MakeAppointment({navigation}: RootTabScreenProps<'MakeAppointment'>) {
  return (
    <Box p={10}>
      <Button startIcon={<FontAwesome name="calendar" />}>
        Find an appointment
      </Button>
    </Box>
  )
}
