export const getInitials = (firstName: string, lastName: string) => {
  return (firstName[0] + lastName[0]).toUpperCase();
};

export const getInitialsFullname = (fullname: string) => {
	const parts = fullname.trim().split(/\s+/).filter(Boolean);
	
	if (parts.length === 0) return '';
	if (parts.length === 1) return parts[0][0].toUpperCase();
	
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
