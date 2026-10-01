import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { Box, Fab, FabIcon } from "@gluestack-ui/themed";
import { Plus, LogOut, NotebookPen } from "lucide-react-native";
import { ScreenLayout } from "../layouts";
import {
  Header,
  IconButton,
  ThemeToggle,
  UserAvatar,
  SearchBar,
  NoteCard,
  EmptyState,
} from "../components";
import { api } from "../api";
import { useAuth } from "../auth";
import { useTheme } from "../theme";

export default function NotesScreen({ onOpen }) {
  const { user, signOut } = useAuth();
  const { colors } = useTheme();
  const [notes, setNotes] = useState([]);
  const [q, setQ] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      setNotes(await api.listNotes(q.trim()));
    } finally {
      setRefreshing(false);
    }
  }, [q]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <ScreenLayout
      header={
        <Header
          title="Notas"
          right={
            <>
              <ThemeToggle />
              <IconButton
                icon={LogOut}
                label="Cerrar sesión"
                onPress={signOut}
              />
              <UserAvatar user={user} />
            </>
          }
        />
      }
      footer={
        <Fab
          size="lg"
          placement="bottom right"
          onPress={() => onOpen(null)}
          accessibilityLabel="Nueva nota"
        >
          <FabIcon as={Plus} />
        </Fab>
      }
    >
      <Box pb="$3">
        <SearchBar value={q} onChangeText={setQ} />
      </Box>

      <FlatList
        data={notes}
        keyExtractor={(n) => n._id}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: 120, gap: 12 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={load}
            tintColor={colors.icon}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={NotebookPen}
            message={
              q
                ? "Sin resultados para tu búsqueda."
                : "Aún no tienes notas. Toca + para crear la primera."
            }
          />
        }
        renderItem={({ item }) => <NoteCard note={item} onPress={onOpen} />}
      />
    </ScreenLayout>
  );
}
