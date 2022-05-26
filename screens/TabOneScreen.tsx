import { FontAwesome } from '@expo/vector-icons';
import { Box, Button } from 'native-base';
import { StyleSheet } from 'react-native';

import { RootTabScreenProps } from '../types';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  return (
    <Box padding={10}>

      <Button leftIcon={<FontAwesome name='calendar' />}>
        Book an appointment
      </Button>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
