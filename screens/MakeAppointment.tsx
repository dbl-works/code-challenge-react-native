import { FontAwesome } from "@expo/vector-icons";
import { Box, Button, Icon } from 'native-base';

import { RootTabScreenProps } from '../types';

export default function MakeAppointment({navigation}: RootTabScreenProps<'MakeAppointment'>) {
  return (
    <Box padding={10}>

      <Button leftIcon={<FontAwesome name="calendar"/>}>
        Find an appointment
      </Button>
    </Box>
  )
}
