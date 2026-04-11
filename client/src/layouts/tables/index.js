import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";

import {
  createSession,
  deleteSession,
  fetchMovies,
  fetchMoviesCount,
  fetchSessions,
  fetchMoviesForDropdown,
  updateSession,
} from "api";
import SessionDialog from "layouts/tables/SessionDialog";
import "./agGridDashboard.css";

function Tables() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const gridRef = useRef(null);
  const [moviesCount, setMoviesCount] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [moviesForDropdown, setMoviesForDropdown] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [dialogSession, setDialogSession] = useState(null);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const moviesColumns = useMemo(
    () => [
      { field: "id", headerName: "ID", maxWidth: 100 },
      { field: "title", headerName: "Title", flex: 1, minWidth: 180 },
      { field: "genre", headerName: "Genre", minWidth: 140 },
      { field: "duration", headerName: "Duration", minWidth: 120 },
      { field: "rating", headerName: "Rating", minWidth: 120 },
      { field: "release_date", headerName: "Release Date", minWidth: 140 },
    ],
    []
  );

  const sessionsColumns = useMemo(
    () => [
      { field: "id", headerName: "ID", maxWidth: 100 },
      { field: "movie_title", headerName: "Movie", flex: 1, minWidth: 180 },
      { field: "hall", headerName: "Hall", minWidth: 120 },
      { field: "session_date", headerName: "Date", minWidth: 140 },
      { field: "start_time", headerName: "Start", minWidth: 120 },
      { field: "price", headerName: "Price", minWidth: 120 },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      suppressMovable: true,
      flex: 1,
    }),
    []
  );

  const gridClassName = darkMode
    ? "ag-theme-alpine dashboard-grid dashboard-grid--dark"
    : "ag-theme-alpine dashboard-grid";
  const actionButtonSx = useMemo(
    () => ({
      minWidth: 160,
      boxShadow: "none",
      borderRadius: "0.875rem",
      "&:hover": {
        boxShadow: "none",
      },
    }),
    []
  );

  const editButtonSx = useMemo(
    () => ({
      ...actionButtonSx,
      backgroundColor: "transparent",
      color: "#ffffff",
      border: "1px solid rgba(255, 255, 255, 0.6)",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderColor: "#ffffff",
        boxShadow: "none",
      },
      "&.Mui-disabled": {
        backgroundColor: "transparent",
        color: "rgba(255, 255, 255, 0.45)",
        borderColor: "rgba(255, 255, 255, 0.18)",
      },
    }),
    [actionButtonSx]
  );

  const deleteButtonSx = useMemo(
    () => ({
      ...actionButtonSx,
      backgroundColor: "#F44335",
      color: "#ffffff",
      "&:hover": {
        backgroundColor: "#f65f53",
        boxShadow: "none",
      },
      "&.Mui-disabled": {
        backgroundColor: "rgba(244, 67, 53, 0.35)",
        color: "rgba(255, 255, 255, 0.72)",
      },
    }),
    [actionButtonSx]
  );

  const loadSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const data = await fetchSessions();
      setSessions(data);
      setSelectedSession(null);
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  const loadMoviesDropdown = useCallback(async () => {
    try {
      const movies = await fetchMoviesForDropdown();
      setMoviesForDropdown(movies);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const loadMoviesCount = useCallback(async () => {
    try {
      const countResponse = await fetchMoviesCount();
      setMoviesCount(countResponse.count);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadSessions();
    loadMoviesDropdown();
    loadMoviesCount();
  }, [loadSessions, loadMoviesDropdown, loadMoviesCount]);

  const movieDatasource = useCallback(
    () => ({
      getRows: async (params) => {
        const limit = params.endRow - params.startRow;
        const offset = params.startRow;

        try {
          const movieRows = await fetchMovies(limit, offset);
          const lastRow = moviesCount !== null ? moviesCount : -1;
          params.successCallback(movieRows, lastRow);
        } catch (error) {
          params.failCallback();
        }
      },
    }),
    [moviesCount]
  );

  const onMoviesGridReady = useCallback(
    (params) => {
      gridRef.current = params.api;
      params.api.setDatasource(movieDatasource());
    },
    [movieDatasource]
  );

  useEffect(() => {
    if (gridRef.current && moviesCount !== null) {
      gridRef.current.setDatasource(movieDatasource());
    }
  }, [movieDatasource, moviesCount]);

  const handleRowSelection = (event) => {
    const selected = event.api.getSelectedRows();
    setSelectedSession(selected.length ? selected[0] : null);
  };

  const openCreateDialog = () => {
    setDialogMode("create");
    setDialogSession(null);
    setDialogOpen(true);
  };

  const openEditDialog = () => {
    if (!selectedSession) {
      return;
    }
    setDialogMode("edit");
    setDialogSession(selectedSession);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSession) {
      return;
    }

    const confirmed = window.confirm("Удалить выбранную сессию?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteSession(selectedSession.id);
      await loadSessions();
    } catch (error) {
      console.error(error);
      alert("Не удалось удалить запись");
    }
  };

  const handleDialogSubmit = async (payload) => {
    try {
      if (dialogMode === "create") {
        await createSession(payload);
      } else if (dialogMode === "edit" && selectedSession) {
        await updateSession(selectedSession.id, payload);
      }
      setDialogOpen(false);
      await loadSessions();
    } catch (error) {
      console.error(error);
      alert("Не удалось сохранить запись");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Фильмы
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2} pb={2}>
                <div className={gridClassName} style={{ width: "100%", height: 520 }}>
                  <AgGridReact
                    columnDefs={moviesColumns}
                    defaultColDef={defaultColDef}
                    rowModelType="infinite"
                    cacheBlockSize={20}
                    maxBlocksInCache={3}
                    domLayout="autoHeight"
                    onGridReady={onMoviesGridReady}
                    pagination={false}
                    rowSelection="single"
                    suppressRowClickSelection
                    overlayLoadingTemplate='<span class="ag-overlay-loading-center">Загрузка...</span>'
                    overlayNoRowsTemplate='<span class="ag-overlay-no-rows-center">Нет данных</span>'
                  />
                </div>
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Сеансы
                </MDTypography>
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" onClick={openCreateDialog} sx={editButtonSx}>
                    Добавить
                  </Button>
                  <Button
                    variant="outlined"
                    disabled={!selectedSession}
                    onClick={openEditDialog}
                    sx={editButtonSx}
                  >
                    Изменить
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!selectedSession}
                    onClick={handleDelete}
                    sx={deleteButtonSx}
                  >
                    Удалить
                  </Button>
                </Stack>
              </MDBox>
              <MDBox pt={3} px={2} pb={2}>
                <div className={gridClassName} style={{ width: "100%", height: 420 }}>
                  <AgGridReact
                    rowData={sessions}
                    columnDefs={sessionsColumns}
                    defaultColDef={defaultColDef}
                    rowSelection="single"
                    onSelectionChanged={handleRowSelection}
                    animateRows
                    pagination
                    paginationPageSize={10}
                    overlayLoadingTemplate='<span class="ag-overlay-loading-center">Загрузка...</span>'
                    overlayNoRowsTemplate='<span class="ag-overlay-no-rows-center">Нет данных</span>'
                  />
                </div>
                {loadingSessions && (
                  <Typography variant="body2" mt={2}>
                    Загружаем сессии...
                  </Typography>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <SessionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        movies={moviesForDropdown}
        initialData={dialogMode === "edit" ? dialogSession : null}
        title={dialogMode === "create" ? "Добавить сессию" : "Изменить сессию"}
      />
    </DashboardLayout>
  );
}

export default Tables;
