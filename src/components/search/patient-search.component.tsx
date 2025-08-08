import { Search } from "@carbon/react/icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./search.scss";


interface Patient {
    id: string;
    name: string;
    age: number;
}

const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;

    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    if(monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age --;
    }
    return age;
};


const PatientSearch: React.FC = () => {
   const {t} = useTranslation();
   const [searchTerm, setSearchTerm] = useState('');
   const [error, setError] = useState('');
   const [patients, setPatients] = useState<Patient[]>([]);
   const [isLoading, setIsLoading] = useState(false);

   const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!searchTerm.trim()) return;

    setIsLoading(true);
    setError('');
    setPatients([]);

    const fhirBaseUrl = window.getOpenmrsSpaBase().replace('/spa', '');
    const apiUrl = `${fhirBaseUrl}/ws/fhir2/R4/Patient?name=${encodeURIComponent(searchTerm)}`;

    try{
        const response = await fetch(apiUrl);
        if(!response.ok) {
            throw new Error(t('errorFetchingData', 'Failed to fetch patient data. Please check the name and try again.'));
        }
        const data = await response.json();
        if(data.entry && data.entry.length > 0) {
            const patientList: Patient[] = data.entry.map((entry: any) => {
            const resource = entry.resource;
            const officialName = resource.name?.find(n => n.use === 'official') || resource.name?.[0];
            return {
                id: resource.id,
                name: officialName ? `${officialName.given?.join(' ') || ''} ${officialName.family || ''}`.trim() : t('nameNotAvailable', 'Name not available'),
                age: calculateAge(resource.birthDate),
            };
            });
            setPatients(patientList);
        } else {
            setError(t('noPatientsFound', 'No patients found with that name.'));
        }

    } catch (err) {
        setError(err.Messsage);
    } finally {
        setIsLoading(false);
    }
   };

   
    return (
        <div className={styles.searchContainer}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
                <div className={styles.inputGroup}>
                    <Search size={24} className={styles.searchIcon}/>
                     <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('searchPatientPlaceholder', 'Search for a patient by name...')}
                        className={styles.searchInput}
                    />
                </div>
                <button type="submit" className={styles.searchButton} disabled={isLoading}>
                    {isLoading ? t('searching', 'Searching...') : t('search', 'Search')}
                </button>
            </form>

            {error && <p className={styles.tableContainer}>{error}</p>}

            {patients.length > 0 && (
            <div >
                <table className={styles.patientTable}>
                    <thead>
                        <tr>
                            <th>{t('patientName', 'Patient Name')}</th>
                            <th>{t('age', 'Patient Age')}</th>
                            <th>{t('openmrsId', 'OpenMRS ID')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient) => (
                            <tr key={patient.id}>
                            <td>{patient.name}</td>
                            <td>{patient.age > 0 ? patient.age : t('notAvailable', 'N/A')}</td>
                            <td>{patient.id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
            
        </div>
    );
};

export default PatientSearch;
