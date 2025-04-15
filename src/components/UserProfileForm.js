import React, { useCallback, useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Grid,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  Typography,
} from '@mui/material';

// Helper component for Tab Panels (MUI recommended pattern)
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const UserProfileForm = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  // Initialize react-hook-form with default values
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      personal_info: {
        full_name: '',
        email: '',
        phone: '',
        address: '',
        linkedin: '',
        facebook: '',
        x: '',
      },
      experiences: [],
      educations: [],
      skills: [],
      certifications: [],
      projects: [],
    },
  });

  // Field arrays for dynamic sections
  const { fields: expFields, append: appendExp } = useFieldArray({
    control,
    name: 'experiences',
  });
  const { fields: eduFields, append: appendEdu } = useFieldArray({
    control,
    name: 'educations',
  });
  const { fields: skillFields, append: appendSkill } = useFieldArray({
    control,
    name: 'skills',
  });
  const { fields: certFields, append: appendCert } = useFieldArray({
    control,
    name: 'certifications',
  });
  const { fields: projFields, append: appendProj } = useFieldArray({
    control,
    name: 'projects',
  });

  // Fetch existing profile data if available
  const getUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/user-profile/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Transform used_skills from array to string for textarea display
      const transformedData = {
        ...res.data,
        projects: res.data.projects.map((project) => ({
          ...project,
          used_skills: project.used_skills ? project.used_skills.join(', ') : '',
        })),
      };
      reset(transformedData);
      setIsEditMode(true);
    } catch (error) {
      if (error.response?.status === 404) {
        // No profile found, remain in create mode
        setIsEditMode(false);
      } else {
        alert('Error fetching user profile: ' + (error.response?.data?.detail || 'Unknown error'));
      }
    }
  }, [reset]);

  // On mount, fetch existing profile if available
  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  // Handle form submission (create/update)
  const onSubmit = async (data) => {
    try {
      // Convert project used_skills back to an array
      const transformedData = {
        ...data,
        projects: data.projects.map((project) => ({
          ...project,
          used_skills: project.used_skills
            ? project.used_skills.split(',').map((skill) => skill.trim())
            : [],
        })),
      };

      const token = localStorage.getItem('token');
      
      if (isEditMode) {
         await axios.put('http://localhost:8000/user-profile/', transformedData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Profile updated successfully!');
      } else {
            await axios.post('http://localhost:8000/user-profile/', transformedData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Profile saved successfully!');
      }
      // Optionally navigate to a profile view page
      navigate('/profile');
    } catch (error) {
      alert('Error saving profile: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  // Handler for tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Render personal information section
  const renderPersonalInfo = () => (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
        slotProps={{ inputLabel: { shrink: true } }}
          label="Full Name"
          error={!!errors.personal_info?.full_name}
          helperText={errors.personal_info?.full_name?.message}
          {...register('personal_info.full_name', { required: 'Full name is required' })}
        />
        <TextField
        slotProps={{ inputLabel: { shrink: true } }}
          label="Email"
          type="email"
          error={!!errors.personal_info?.email}
          helperText={errors.personal_info?.email?.message}
          {...register('personal_info.email', { required: 'Email is required' })}
        />
        <TextField
        slotProps={{ inputLabel: { shrink: true } }}
          label="Phone"
          error={!!errors.personal_info?.phone}
          helperText={errors.personal_info?.phone?.message}
          {...register('personal_info.phone', { required: 'Phone is required' })}
        />
        <TextField
        slotProps={{ inputLabel: { shrink: true } }}
          label="Address"
          error={!!errors.personal_info?.address}
          helperText={errors.personal_info?.address?.message}
          {...register('personal_info.address', { required: 'Address is required' })}
        />
        <TextField
        slotProps={{ inputLabel: { shrink: true } }}
          label="LinkedIn (optional)"
          {...register('personal_info.linkedin')}
        />
        <TextField
        slotProps={{ inputLabel: { shrink: true } }}
          label="Facebook (optional)"
          {...register('personal_info.facebook')}
        />
        <TextField
        slotProps={{ inputLabel: { shrink: true } }}
          label="X (Twitter) (optional)"
          {...register('personal_info.x')}
        />
      </Box>
    </Paper>
  );

  // Render the detailed sections inside a tabbed interface
  const renderTabbedSections = () => (
    <Paper sx={{ p: 2 }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
      >
        <Tab label="Experience" />
        <Tab label="Education" />
        <Tab label="Skills" />
        <Tab label="Certifications" />
        <Tab label="Projects" />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        {/* Experience Section */}
        {expFields.map((field, index) => (
          <Box key={field.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
            <TextField
              fullWidth
              label="Title"
              error={!!errors.experiences?.[index]?.title}
              helperText={errors.experiences?.[index]?.title?.message}
              {...register(`experiences.${index}.title`, { required: 'Title is required' })}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              label="Company"
              error={!!errors.experiences?.[index]?.company}
              helperText={errors.experiences?.[index]?.company?.message}
              {...register(`experiences.${index}.company`, { required: 'Company is required' })}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              multiline
              label="Description"
              error={!!errors.experiences?.[index]?.description}
              helperText={errors.experiences?.[index]?.description?.message}
              {...register(`experiences.${index}.description`, { required: 'Description is required' })}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.experiences?.[index]?.start_date}
              helperText={errors.experiences?.[index]?.start_date?.message}
              {...register(`experiences.${index}.start_date`, { required: 'Start date is required' })}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              type="date"
              label="End Date (optional)"
              InputLabelProps={{ shrink: true }}
              {...register(`experiences.${index}.end_date`)}
            />
          </Box>
        ))}
        <Button variant="contained" onClick={() => appendExp({})}>
          Add Experience
        </Button>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {/* Education Section */}
        {eduFields.map((field, index) => (
          <Box key={field.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
            <TextField
              fullWidth
              label="School"
              error={!!errors.educations?.[index]?.school}
              helperText={errors.educations?.[index]?.school?.message}
              {...register(`educations.${index}.school`, { required: 'School is required' })}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              label="Degree"
              error={!!errors.educations?.[index]?.degree}
              helperText={errors.educations?.[index]?.degree?.message}
              {...register(`educations.${index}.degree`, { required: 'Degree is required' })}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.educations?.[index]?.start_date}
              helperText={errors.educations?.[index]?.start_date?.message}
              {...register(`educations.${index}.start_date`, { required: 'Start date is required' })}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              type="date"
              label="End Date (optional)"
              InputLabelProps={{ shrink: true }}
              {...register(`educations.${index}.end_date`)}
            />
          </Box>
        ))}
        <Button variant="contained" onClick={() => appendEdu({})}>
          Add Education
        </Button>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {/* Skills Section */}
        {skillFields.map((field, index) => (
          <Box key={field.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
            <TextField
              fullWidth
              label="Skill"
              error={!!errors.skills?.[index]?.skill_name}
              helperText={errors.skills?.[index]?.skill_name?.message}
              {...register(`skills.${index}.skill_name`, { required: 'Skill is required' })}
            />
          </Box>
        ))}
        <Button variant="contained" onClick={() => appendSkill({})}>
          Add Skill
        </Button>
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        {/* Certifications Section */}
        {certFields.map((field, index) => (
          <Box key={field.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
            <TextField
              fullWidth
              label="Title"
              error={!!errors.certifications?.[index]?.title}
              helperText={errors.certifications?.[index]?.title?.message}
              {...register(`certifications.${index}.title`, { required: 'Title is required' })}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              label="Authority"
              error={!!errors.certifications?.[index]?.authority}
              helperText={errors.certifications?.[index]?.authority?.message}
              {...register(`certifications.${index}.authority`, { required: 'Authority is required' })}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              type="date"
              label="Date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.certifications?.[index]?.date}
              helperText={errors.certifications?.[index]?.date?.message}
              {...register(`certifications.${index}.date`, { required: 'Date is required' })}
            />
          </Box>
        ))}
        <Button variant="contained" onClick={() => appendCert({})}>
          Add Certification
        </Button>
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        {/* Projects Section */}
        {projFields.map((field, index) => (
          <Box key={field.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
            <TextField
              fullWidth
              label="Title"
              error={!!errors.projects?.[index]?.title}
              helperText={errors.projects?.[index]?.title?.message}
              {...register(`projects.${index}.title`, { required: 'Title is required' })}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              multiline
              label="Description"
              error={!!errors.projects?.[index]?.description}
              helperText={errors.projects?.[index]?.description?.message}
              {...register(`projects.${index}.description`, { required: 'Description is required' })}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              label="Link (optional)"
              {...register(`projects.${index}.link`)}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              multiline
              label="Used Skills (comma-separated)"
              placeholder="e.g., Python, React, SQL"
              {...register(`projects.${index}.used_skills`)}
            />
          </Box>
        ))}
        <Button variant="contained" onClick={() => appendProj({})}>
          Add Project
        </Button>
      </TabPanel>
    </Paper>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} sx={{ p: 2 }}>
        <Grid item xs={12} md={6}>
          {renderPersonalInfo()}
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button type="submit" variant="contained" color="primary">
              {isEditMode ? 'Update Profile' : 'Save Profile'}
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          {renderTabbedSections()}
        </Grid>
      </Grid>
    </form>
  );
};

export default UserProfileForm;