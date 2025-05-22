import React, { useState }  from 'react';
import HeaderMain from './components/header';
import Footer from './components/footer';
import BannerSection from './components/bannerSectionInner';
import searchIcon from '../src/assets/images/searchIcon.png'
import ProfileImage from  '../src/assets/images/profileImage.jpg'
import JobCards from './components/jobsCard';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { Range } from 'react-range';
// const MIN = 0;
// const MAX = 100000;

const JobList = () => {
    const MIN = 0;
    const MAX = 100000;
    const [selectedOption, setSelectedOption] = useState(null);
    const [sortOption, setsortOption] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [radioVal, setradioVal] = useState('');
    const [values, setValues] = useState([20000, 80000]); 

    const handleChange = (e) => {
        setSearchKeyword(e.target.value); 
    };

    
    const handleChangeRadio = (e) => {
        setradioVal(e.target.value)
    }
    
    const options = [
        { value: 'fullTime', label: 'Full Time' },
        { value: 'partTime', label: 'Part Time' },
        { value: 'remote', label: 'Remote' },
        { value: 'internship', label: 'Internship' },
    ];

    const sortOptions= [
        { value: 'default', label: 'Sort by default' },
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
    ]

    const radioOption  = [
        {value:'last_hour', label:'Last Hour'},
        {value:'last_24hour', label:'Last 24 hours'},
        {value:'last_7days', label:'Last 7 days'},
        {value:'last_14days', label:'Last 14 days'},
        {value:'last_30days', label:'Last 30 days'},
        {value:'all_days', label:'All days'}
    ]
    const experinceLevel  = [
        {value:'fresher', label:'Fresher'},
        {value:'one_year', label:'1 Year'},
        {value:'two_years', label:'2 Years'},
        {value:'three_years', label:'3 Years'},
        {value:'four_years', label:'4 Years'},
        {value:'fiveplus_years', label:'5+ Years'}
    ]

    const cardInfoJob = [
        {
            id: 1,
            jobTitle:'Finance Manager & Health',
            date:'20-04-2025',
            address:'Canada',
            jobType:'Full Time',
            experince:'Fresher - 2 Years',
            salary:'500',
            salaryType:'Weekly',
            loginStatus: true,
            profileImg: ProfileImage,
            rating:'5.0',
        },
        {
            id: 2,
            jobTitle:'Finance Manager & Health',
            date:'24-04-2025',
            address:'Canada',
            jobType:'Full Time',
            experince:'Fresher - 2 Years',
            salary:'600',
            salaryType:'Monthly',
            loginStatus: false,
            profileImg: '',
            rating:'3.5',
        },
        {
            id: 3,
            jobTitle:'Finance Manager & Health',
            date:'20-04-2025',
            address:'Canada',
            jobType:'Full Time',
            experince:'Fresher - 2 Years',
            salary:'500',
            salaryType:'Weekly',
            loginStatus: true,
            profileImg: '',
            rating:'4.5',
        },
        {
            id: 4,
            jobTitle:'Finance Manager & Health',
            date:'24-04-2025',
            address:'Canada',
            jobType:'Full Time',
            experince:'Fresher - 2 Years',
            salary:'600',
            salaryType:'Monthly',
            loginStatus: false,
            profileImg: ProfileImage,
            rating:'3.5',
        },
        {
            id: 5,
            jobTitle:'Finance Manager & Health',
            date:'20-04-2025',
            address:'Canada',
            jobType:'Full Time',
            experince:'Fresher - 2 Years',
            salary:'500',
            salaryType:'Weekly',
            loginStatus: true,
            profileImg: ProfileImage,
            rating:'5.0',
        },
        {
            id: 6,
            jobTitle:'Finance Manager & Health',
            date:'24-04-2025',
            address:'Canada',
            jobType:'Full Time',
            experince:'Fresher - 2 Years',
            salary:'600',
            salaryType:'Monthly',
            loginStatus: false,
            profileImg: '',
            rating:'5.0',
        },
        {
            id: 7,
            jobTitle:'Finance Manager & Health',
            date:'20-04-2025',
            address:'Canada',
            jobType:'Full Time',
            experince:'Fresher - 2 Years',
            salary:'500',
            salaryType:'Weekly',
            loginStatus: true,
            profileImg: '',
            rating:'4.0',
        },
        {
            id: 8,
            jobTitle:'Finance Manager & Health',
            date:'24-04-2025',
            address:'Canada',
            jobType:'Full Time',
            experince:'Fresher - 2 Years',
            salary:'600',
            salaryType:'Monthly',
            loginStatus: false,
            profileImg: ProfileImage,
            rating:'4.5',
        }
    ]



    return(
        <>
            <HeaderMain/>
                <BannerSection 
                 htmlContent={`
                    <div class="text-center bannerTitleStyle">
                        <h1 class="text-capitalize mb-3">{{title}}</h1>
                        <ul class="breadCrumbStyle">
                        <li><a href="/">Home</a></li>
                        <li>{{title}}</li>
                        </ul>
                    </div>
                  `}
                  data={{ title: 'Job Title' }}
                />
                <section className="filterSectionMain bg-white">
                    <div className='custom-container'>
                        <div className="row pt-5 gx-5">
                            <div className="col-md-4">
                                <div className='card'>
                                    <div className='card-body bg-lightBlue cardCustomBodyFilter'>
                                        <div className='mainFilterDiv'>
                                            <div className='text-end mb-2'>
                                                <Link to='#' className='text-theme text-decoration-underline'>Clear All</Link>
                                            </div>
                                            <div className='groupLabelFilter'>
                                                <label className='labelStyleKeyWords mb-2'>Search by Keywords</label>
                                                <div className='inputGroup'>
                                                    <img src={searchIcon}/>
                                                    <input type="text" placeholder='Job Title, Keywords' value={searchKeyword} onChange={handleChange} />
                                                </div>
                                                
                                            </div>
                                            <div className='groupLabelFilter'>
                                                <label className='labelStyleKeyWords mb-2'>Job type</label>
                                                <div className='inputGroup'>
                                                <Select
                                                    defaultValue={selectedOption}
                                                    onChange={setSelectedOption}
                                                    options={options}
                                                    styles={{
                                                        control: (baseStyles, state) => ({
                                                          ...baseStyles,
                                                          border: 'none',           
                                                          boxShadow: 'none',        
                                                          height: '54px',           
                                                          minHeight: '54px',       
                                                        }),
                                                        valueContainer: (base) => ({
                                                          ...base,
                                                          height: '54px',          
                                                          padding: '0 12px',
                                                        }),
                                                        indicatorsContainer: (base) => ({
                                                          ...base,
                                                          height: '54px',
                                                        }),
                                                    }}
                                                />
                                                </div>
                                            </div>
                                            <div className='groupLabelFilter'>
                                                <label className='labelStyleKeyWords mb-2'>Date Posted</label>
                                                <div className='inputGroup'>
                                                    {radioOption.map((radioList) => (
                                                    <div className='inputRadioCStm' key={radioList.value}>
                                                        <input type="radio"
                                                        id={radioList.value} 
                                                        name="radioOption"
                                                        value={radioList.value} 
                                                        checked={radioVal === radioList.value}  
                                                        onChange={handleChangeRadio}/>
                                                        <label htmlFor={radioList.value}>{radioList.label}</label>
                                                    </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className='groupLabelFilter'>
                                                <label className='labelStyleKeyWords mb-2'>Experience Level</label>
                                                <div className='inputGroup'>
                                                    {experinceLevel.map((experinceList) => (
                                                    <div className="contCstm" key={experinceList.value}>
                                                        <div className="toggleCstm">
                                                            <input type="checkbox" 
                                                            id={experinceList.value} 
                                                            className="toggle__input"
                                                             />
                                                            <label htmlFor={experinceList.value}>
                                                                <span className="toggle__label"></span>
                                                                <span className="labelTextChange">{experinceList.label}</span>
                                                            </label>
                                                            
                                                        </div>
                                                    </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className='groupLabelFilter'>
                                                <label className='labelStyleKeyWords mb-2'>Salary</label>
                                                <div className='inputGroup'>
                                                    <div style={{ width: '100%', marginTop: '15px'}}>
                                                        <div className="rangeSliderText">
                                                            <span>
                                                                ₹{values[0]}
                                                            </span>
                                                            <span>
                                                                ₹{values[1]}
                                                            </span>
                                                        </div>
                                                        <Range
                                                            step={1000}
                                                            min={MIN}
                                                            max={MAX}
                                                            values={values}
                                                            onChange={(newValues) => setValues(newValues)}
                                                            renderTrack={({ props, children }) => (
                                                            <div
                                                                {...props}
                                                                style={{
                                                                ...props.style,
                                                                height: '6px',
                                                                width: '100%',
                                                                background: `linear-gradient(to right, #ccc ${((values[0] - MIN) / (MAX - MIN)) * 100}%, #7903ee ${((values[0] - MIN) / (MAX - MIN)) * 100}%, #7903ee ${((values[1] - MIN) / (MAX - MIN)) * 100}%, #ccc ${((values[1] - MIN) / (MAX - MIN)) * 100}%)`,
                                                                borderRadius: '4px',
                                                                margin: '15px 0',
                                                                }}
                                                            >
                                                                {children}
                                                            </div>
                                                            )}
                                                            renderThumb={({ props }) => (
                                                                <div
                                                                    {...props}
                                                                    style={{
                                                                    ...props.style,
                                                                    height: '24px',
                                                                    width: '24px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: '#fff',
                                                                    border: '2px solid #7903ee',
                                                                    boxShadow: '0 0 4px rgba(0,0,0,0.2)',
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-5">
                                                <button type='submit' className='btn btn-primary w-100'>Find Jobs</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className='row mb-3 gx-3 align-items-center'>
                                    <div className='col'>
                                        <p class="mb-0">Showing 1 – 10 of 15 results</p>
                                    </div>
                                    <div className='col-auto'>
                                    <Select
                                        defaultValue={sortOption}
                                        onChange={setsortOption}
                                        options={sortOptions}
                                        styles={{
                                            control: (baseStyles, state) => ({
                                                ...baseStyles,
                                                border: 'none',           
                                                boxShadow: 'none',        
                                                height: '50px',           
                                                minHeight: '50px',
                                                backgroundColor: '#f8f8f8',
                                                minWidth:'150px'      
                                            }),
                                            valueContainer: (base) => ({
                                                ...base,
                                                height: '50px',          
                                                padding: '0 12px',
                                            }),
                                            indicatorsContainer: (base) => ({
                                                ...base,
                                                height: '50px',
                                            }),
                                        }}
                                    />
                                    </div>
                                </div>
                                <div className="row gx-3">
                                    {cardInfoJob.map((jobInfo) => (
                                        <div className='col-md-6' key={jobInfo.id}>
                                            <JobCards jobData={jobInfo} />
                                        </div>
                                    ))}

                                </div>
                                <div class="jobs-pagination-wrapper main-pagination-wrapper">
                                    <ul class="paginationStyle">
                                        <li>
                                            <Link to=""><i class="ri-arrow-left-line"></i></Link>
                                        </li>
                                        <li><span aria-current="page" class="page-numbers current">1</span></li>
                                        <li><Link class="page-numbers"
                                                to="#">2</Link></li>
                                        <li>
                                            <Link class="next page-numbers"
                                                href="https://apusthemes.com/wp-demo/superio/job-list/page/2/?filter-orderby=menu_order">
                                                    <i class="ri-arrow-right-line"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            <Footer />
        </>
    )
}
export default JobList
