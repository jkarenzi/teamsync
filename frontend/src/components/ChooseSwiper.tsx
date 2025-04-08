"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

interface IProps {
    icon:string,
    title:string,
    description:string
}

const Card = ({icon, title, description}:IProps) => (
    <div className="flex flex-col justify-between bg-white shadow-all-sides rounded-lg w-full h-full py-8 px-6">
        <img
            alt='icon'
            src={icon} 
            width={40}
        />
        <div className='w-full flex flex-col gap-4'>
            <h2 className="font-bold text-xl">{title}</h2>
            <p className="text-justify font-medium w-full text-sm">{description}</p>
        </div>
    </div>
)

const list = [{
    icon: '/collaboration.png',
    title: 'Task Management',
    description: "Assign, track, and manage tasks with ease to ensure everyone knows their role."
},{
    icon: '/graph.png',
    title: 'Contribution Tracking',
    description: "Monitor individual contributions with detailed reports to ensure fairness and transparency."
},{
    icon: '/assessment.png',
    title: 'Peer & Self Assessments',
    description: "Foster accountability with fair and anonymous evaluations."
},
{
    icon: '/discussion.png',
    title: 'Discussion forums',
    description: "Brainstorm on group projects through our group chats and discussion forums."
}]


const ChooseSwiper = () => {
    return (
        <Swiper
            breakpoints={{
                320: {slidesPerView: 1},
                640: {slidesPerView: 1},
                768: {slidesPerView: 2},
                1025: {slidesPerView: 3}
            }}
            modules={[Pagination, Autoplay]}
            spaceBetween={50}
            pagination={{ clickable: true }}
            loop
            className="xs:w-full lg:w-[90%] xs:!pb-16 xs:!px-2 xs:!pt-2 lg:!pb-20 lg:!px-2 lg:!pt-2"
            autoplay
        >
            {list.map((card) => (
                <SwiperSlide className='xs:w-full xs:!h-[15rem] lg:w-[19rem] lg:!h-[15rem]' key={crypto.randomUUID()}>
                    <Card icon={card.icon} title={card.title} description={card.description}/>
                </SwiperSlide>                   
            ))}
        </Swiper>
    );
}
 
export default ChooseSwiper;