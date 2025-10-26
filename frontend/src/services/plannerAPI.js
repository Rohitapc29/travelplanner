export const savePlan = async (planData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token found');


    const formattedPlan = {
      ...planData,
      schedule: planData.schedule.map(day => ({
        attractions: day.attractions.map(attr => ({
          name: attr.name,
          description: attr.description || '',
          thumbnail: attr.thumbnail || null,
          suggestedDuration: attr.suggestedDuration || 1,
          category: attr.category || '',
          coordinates: attr.coordinates || null,
          startTime: attr.startTime || '00:00',
          endTime: attr.endTime || '23:59'
        }))
      }))
    };

    const response = await fetch('http://localhost:4000/api/plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formattedPlan)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving plan:', error);
    throw error;
  }
};

export const getPlans = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token found');

    const response = await fetch('http://localhost:4000/api/plans', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching plans:', error);
    return [];
  }
};