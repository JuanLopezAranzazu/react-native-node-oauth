import React, { useState } from "react";
import { Alert } from "react-native";
import {
  VStack,
  Input,
  InputField,
  Textarea,
  TextareaInput,
  Button,
  ButtonText,
  ButtonSpinner,
  ButtonIcon,
} from "@gluestack-ui/themed";
import { ArrowLeft, Check, Pin, PinOff, Trash2 } from "lucide-react-native";
import { ScreenLayout } from "../layouts";
import { Header, IconButton } from "../components";
import { api } from "../api";
import { useTheme } from "../theme";

export default function EditorScreen({ note, onClose }) {
  const { colors } = useTheme();
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [pinned, setPinned] = useState(!!note?.pinned);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!title.trim() && !content.trim()) return onClose();
    setSaving(true);
    try {
      const data = { title, content, pinned };
      note ? await api.updateNote(note._id, data) : await api.createNote(data);
      onClose();
    } catch (e) {
      Alert.alert("No se pudo guardar", e.message);
      setSaving(false);
    }
  };

  const remove = () =>
    Alert.alert("Eliminar nota", "Esta acción no se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await api.deleteNote(note._id);
          onClose();
        },
      },
    ]);

  return (
    <ScreenLayout
      keyboard
      header={
        <Header
          left={
            <IconButton icon={ArrowLeft} label="Volver" onPress={onClose} />
          }
          right={
            <>
              <IconButton
                icon={pinned ? PinOff : Pin}
                label={pinned ? "Desfijar" : "Fijar"}
                onPress={() => setPinned(!pinned)}
              />
              {note && (
                <IconButton
                  icon={Trash2}
                  label="Eliminar nota"
                  color={colors.danger}
                  onPress={remove}
                />
              )}
              <Button size="sm" onPress={save} isDisabled={saving}>
                {saving ? (
                  <ButtonSpinner mr="$2" />
                ) : (
                  <ButtonIcon as={Check} mr="$1" />
                )}
                <ButtonText>Guardar</ButtonText>
              </Button>
            </>
          }
        />
      }
    >
      <VStack space="md" flex={1}>
        <Input variant="underlined" size="xl" borderColor={colors.border}>
          <InputField
            placeholder="Título"
            value={title}
            onChangeText={setTitle}
            fontWeight="$bold"
          />
        </Input>
        <Textarea flex={1} borderWidth={0} bg="transparent">
          <TextareaInput
            placeholder="Escribe aquí…"
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />
        </Textarea>
      </VStack>
    </ScreenLayout>
  );
}
