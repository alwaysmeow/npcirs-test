import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: "2.75rem",
  },
};

function SessionDialog({ open, onClose, onSubmit, movies, initialData, title }) {
  const [form, setForm] = useState({
    movie_id: "",
    hall: "",
    session_date: "",
    start_time: "",
    price: "",
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (initialData) {
      setForm({
        movie_id: String(initialData.movie_id),
        hall: initialData.hall,
        session_date: initialData.session_date,
        start_time: initialData.start_time,
        price: String(initialData.price),
      });
    } else {
      setForm({
        movie_id: "",
        hall: "",
        session_date: "",
        start_time: "",
        price: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit({
      movie_id: Number(form.movie_id),
      hall: form.hall,
      session_date: form.session_date,
      start_time: form.start_time,
      price: Number(form.price),
    });
  };

  const isValid =
    form.movie_id !== "" &&
    form.hall.trim() !== "" &&
    form.session_date.trim() !== "" &&
    form.start_time.trim() !== "" &&
    form.price !== "";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent sx={{ pt: "12px !important" }}>
        <Box
          display="grid"
          gap={2}
          mt={1}
          gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }}
        >
          <TextField
            select
            label="Фильм"
            name="movie_id"
            value={form.movie_id}
            onChange={handleChange}
            fullWidth
            sx={{ ...fieldSx, gridColumn: { xs: "1 / -1", sm: "1 / -1" } }}
          >
            {movies.map((movie) => (
              <MenuItem key={movie.id} value={movie.id}>
                {movie.title}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Дата"
            type="date"
            name="session_date"
            value={form.session_date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={fieldSx}
          />
          <TextField
            label="Время"
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={fieldSx}
          />
          <TextField
            label="Зал"
            name="hall"
            value={form.hall}
            onChange={handleChange}
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label="Цена"
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            fullWidth
            sx={fieldSx}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button onClick={onClose}>Отмена</Button>
        <Button disabled={!isValid} onClick={handleSubmit} variant="contained">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SessionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.number,
    movie_id: PropTypes.number,
    hall: PropTypes.string,
    session_date: PropTypes.string,
    start_time: PropTypes.string,
    price: PropTypes.number,
  }),
  title: PropTypes.string.isRequired,
};

export default SessionDialog;
