import {
  Card,
  Flex
} from "@chakra-ui/react";
import {
  Button,
  Input,
  Stack,
  HStack,
  Portal,
} from "@chakra-ui/react";
import { ColorPicker, Field, parseColor } from "@chakra-ui/react";

const ModalEdicaoArea = ({
  titulo,
  nome,
  setNome,
  cor,
  setCor,
  exibirCor = true,
  onSalvar,
  onCancelar,
}) => {
  const rgbaToHex = (rgbaString) => {
    const match = rgbaString.match(/rgba?\((\d+), (\d+), (\d+)/);
    if (!match) return "#ffffff";
    const [, r, g, b] = match.map(Number);
    return (
      "#" +
      [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
    );
  };

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      w="100vw"
      h="100vh"
      bg="blackAlpha.500"
      align="center"
      justify="center"
    >
      <Card.Root maxW="xs" w="full">
        <Card.Header>
          <Card.Title>{titulo}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Stack spacing={4}>
            <Field.Root>
              <Field.Label>Nome</Field.Label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o novo nome"
              />
            </Field.Root>

            {exibirCor && (
              <ColorPicker.Root
                value={parseColor(cor)}
                onValueChange={(colorObj) => {
                  const hex = rgbaToHex(colorObj.valueAsString);
                  setCor(hex);
                }}
                maxW="200px"
              >
                <ColorPicker.HiddenInput />
                <ColorPicker.Label>Cor</ColorPicker.Label>
                <ColorPicker.Control>
                  <ColorPicker.Trigger />
                </ColorPicker.Control>
                <Portal>
                  <ColorPicker.Positioner>
                    <ColorPicker.Content>
                      <ColorPicker.Area />
                      <HStack>
                        <ColorPicker.EyeDropper />
                        <ColorPicker.Sliders />
                      </HStack>
                    </ColorPicker.Content>
                  </ColorPicker.Positioner>
                </Portal>
              </ColorPicker.Root>
            )}
          </Stack>
        </Card.Body>
        <Card.Footer justifyContent="flex-end">
          <Button variant="outline" onClick={onCancelar}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={onSalvar}>
            Salvar
          </Button>
        </Card.Footer>
      </Card.Root>
    </Flex>
  );
};

export default ModalEdicaoArea;
