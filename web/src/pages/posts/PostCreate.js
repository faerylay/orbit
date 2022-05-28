import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { useSelector } from 'react-redux';
import { IconSquarePlus, IconX } from '@tabler/icons';
import { TextField, Button, Paper, Box, Grid, Typography, Fab, IconButton, Modal } from '@mui/material';
import { CREATE_POST, FETCH_POSTS_QUERY, FETCH_USER, GET_AUTH_USER, GET_USER_POSTS, GET_FOLLOWED_POSTS } from '../../graphql';
import { useInput } from '../../hooks/hooks'
import { HOME_PAGE_POSTS_LIMIT, PROFILE_PAGE_POSTS_LIMIT, MAX_POST_IMAGE_SIZE, NotificationType } from '../../constants'
import useNotifications from '../../hooks/useNotifications';

export default function PostCreate() {
  const auth = useSelector(state => state?.users?.user)
  const notification = useNotifications()
  const [errors, setErrors] = useState('')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState([])
  const navigate = useNavigate();
  let title = useInput()
  let description = useInput()

  const [createPost] = useMutation(CREATE_POST, {
    onError(err) {
      setErrors(err.graphQLErrors[0]?.message);
    },
    variables: {
      input: {
        title: title.value,
        description: description.value,
        image: image ? image : null
      }
    },
    refetchQueries: [
      { query: FETCH_POSTS_QUERY },
      { query: FETCH_USER, variables: { getUserId: auth?.id } },
      { query: GET_AUTH_USER },
      { query: GET_USER_POSTS, variables: { userId: auth?.id, offset: 0, limit: PROFILE_PAGE_POSTS_LIMIT } },
      { query: GET_FOLLOWED_POSTS, variables: { userId: auth?.id, offset: 0, limit: HOME_PAGE_POSTS_LIMIT } }
    ]
  })
  const handlePostImageUpload = (e) => {
    const file = e.target.files;
    if (!file) return;
    if (file.size >= MAX_POST_IMAGE_SIZE) {
      console.error(`File size should be less then ${MAX_POST_IMAGE_SIZE / 1000000}MB`);
      return;
    }

    setImage([...image, ...file]);
    e.target.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data } = await createPost()
    setLoading(false)
    title = ''
    description = ''
    setImage([])
    setErrors('')
    navigate('/')
    if (auth?.id) {
      notification.create({
        userId: data?.createPost?.author?.id,
        postId: data?.createPost?.id,
        notificationType: NotificationType.POSTCREATED,
        notificationTypeId: data?.createPost?.id,
      });
    }
  }
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState('')
  const handleOpen = (img) => {
    setOpen(true);
    setPreview(img)
  }
  const handleClose = () => {
    setOpen(false)
    setPreview('')
  };
  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item sm={1} md={2} lg={3} />
          <Grid item xs={12} sm={10} md={8} lg={6} >
            <Paper sx={{ p: 2 }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h3" component="div">Create Post</Typography>
              </Box>
              {
                !!errors && (
                  <Box sx={{ border: 0.5, borderColor: 'red', borderRadius: 2, padding: 1, mb: 2 }}>
                    <Typography
                      variant="body2"
                      component="div"
                      sx={{ textTransform: 'none' }}
                    >
                      {errors}
                    </Typography>
                  </Box>
                )
              }
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Grid container spacing={2} justify='center'>
                  <Grid item xs={12}>
                    <TextField
                      {...title}
                      error={errors ? true : false}
                      type='text'
                      label='Title'
                      variant='outlined'
                      placeholder='title...'
                      fullWidth
                      required
                    />
                    <TextField
                      {...description}
                      error={errors ? true : false}
                      type='text'
                      label='Description'
                      variant='outlined'
                      placeholder='description...'
                      margin='normal'
                      fullWidth
                      required
                    />
                    <Box sx={{ display: 'flex' }}>
                      <label htmlFor="postImage">
                        <input
                          style={{ display: "none" }}
                          id="postImage"
                          name="postImage"
                          type="file"
                          multiple
                          accept="image/x-png,image/jpeg"
                          onChange={handlePostImageUpload}
                        />
                        <Fab
                          color="inherit"
                          size="small"
                          component="span"
                          aria-label="add"
                          variant="extended"
                          sx={{ width: 60, height: 40 }}
                          disableRipple={true}
                          disableFocusRipple={true}
                        >
                          <IconSquarePlus />
                        </Fab>
                      </label>
                      <Box sx={{ width: '100%', height: 50, display: 'flex', overflow: 'scroll', ml: 5 }}>
                        {(image || []).map((url, index) => (
                          <Box key={index.toString()} sx={{ display: 'flex', overflow: 'hidden' }} >
                            <IconButton onClick={() => setImage(image.filter(item => item !== url))} sx={{ position: 'absolute', background: 'red', borderRadius: 1 }}>
                              <IconX size={10} color="#fff" stroke={3} />
                            </IconButton>
                            <img onClick={() => handleOpen(URL.createObjectURL(url))} src={URL.createObjectURL(url)} alt="..." style={{ borderRadius: 5, marginRight: 5, width: 100, height: 50 }} />
                          </Box>
                        ))}
                        <Modal
                          keepMounted
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="keep-mounted-modal-image"
                          aria-describedby="keep-mounted-modal-description"
                        >
                          <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: .5,
                            borderRadius: 3
                          }}>
                            <IconButton onClick={handleClose} sx={{ position: 'absolute', background: 'red', borderRadius: 1, width: 30, height: 30 }}>
                              <IconX size={20} color="#fff" stroke={5} />
                            </IconButton>
                            <img id="keep-mounted-modal-image" src={preview ? preview : null} alt='...' style={{ borderRadius: 5, marginRight: 5, width: '100%', height: 300 }} />
                          </Box>
                        </Modal>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Button type='submit' variant='contained' color='primary' size='large' disabled={loading}>
                      Create Post
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
