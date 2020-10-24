--
-- PostgreSQL database dump
--

-- Dumped from database version 13.0
-- Dumped by pg_dump version 13.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: food; Type: TABLE; Schema: public; Owner: tylergrass
--

CREATE TABLE public.food (
    id integer NOT NULL,
    name character varying(64) NOT NULL
);


ALTER TABLE public.food OWNER TO tylergrass;

--
-- Name: food_id_seq; Type: SEQUENCE; Schema: public; Owner: tylergrass
--

CREATE SEQUENCE public.food_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.food_id_seq OWNER TO tylergrass;

--
-- Name: food_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tylergrass
--

ALTER SEQUENCE public.food_id_seq OWNED BY public.food.id;


--
-- Name: food_nutrient_amount; Type: TABLE; Schema: public; Owner: tylergrass
--

CREATE TABLE public.food_nutrient_amount (
    food_id integer NOT NULL,
    nutrient_info_id integer NOT NULL,
    amount integer DEFAULT 0 NOT NULL,
    CONSTRAINT food_nutrient_amount_amount_check CHECK ((amount >= 0))
);


ALTER TABLE public.food_nutrient_amount OWNER TO tylergrass;

--
-- Name: journal_entry; Type: TABLE; Schema: public; Owner: tylergrass
--

CREATE TABLE public.journal_entry (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    entry_date date NOT NULL
);


ALTER TABLE public.journal_entry OWNER TO tylergrass;

--
-- Name: journal_entry_id_seq; Type: SEQUENCE; Schema: public; Owner: tylergrass
--

CREATE SEQUENCE public.journal_entry_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.journal_entry_id_seq OWNER TO tylergrass;

--
-- Name: journal_entry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tylergrass
--

ALTER SEQUENCE public.journal_entry_id_seq OWNED BY public.journal_entry.id;


--
-- Name: log_food; Type: TABLE; Schema: public; Owner: tylergrass
--

CREATE TABLE public.log_food (
    id integer NOT NULL,
    log_meal_occasion_id integer NOT NULL,
    food_id integer NOT NULL,
    servings numeric DEFAULT 0 NOT NULL,
    CONSTRAINT log_food_servings_check CHECK ((servings >= (0)::numeric))
);


ALTER TABLE public.log_food OWNER TO tylergrass;

--
-- Name: log_food_id_seq; Type: SEQUENCE; Schema: public; Owner: tylergrass
--

CREATE SEQUENCE public.log_food_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.log_food_id_seq OWNER TO tylergrass;

--
-- Name: log_food_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tylergrass
--

ALTER SEQUENCE public.log_food_id_seq OWNED BY public.log_food.id;


--
-- Name: log_meal_occasion; Type: TABLE; Schema: public; Owner: tylergrass
--

CREATE TABLE public.log_meal_occasion (
    id integer NOT NULL,
    occasion_name character varying(30) NOT NULL,
    nutrition_log_id integer NOT NULL
);


ALTER TABLE public.log_meal_occasion OWNER TO tylergrass;

--
-- Name: log_meal_occasion_id_seq; Type: SEQUENCE; Schema: public; Owner: tylergrass
--

CREATE SEQUENCE public.log_meal_occasion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.log_meal_occasion_id_seq OWNER TO tylergrass;

--
-- Name: log_meal_occasion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tylergrass
--

ALTER SEQUENCE public.log_meal_occasion_id_seq OWNED BY public.log_meal_occasion.id;


--
-- Name: nutrient_info; Type: TABLE; Schema: public; Owner: tylergrass
--

CREATE TABLE public.nutrient_info (
    id integer NOT NULL,
    name character varying(30) NOT NULL,
    unit character varying(5) NOT NULL
);


ALTER TABLE public.nutrient_info OWNER TO tylergrass;

--
-- Name: nutrient_info_id_seq; Type: SEQUENCE; Schema: public; Owner: tylergrass
--

CREATE SEQUENCE public.nutrient_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.nutrient_info_id_seq OWNER TO tylergrass;

--
-- Name: nutrient_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tylergrass
--

ALTER SEQUENCE public.nutrient_info_id_seq OWNED BY public.nutrient_info.id;


--
-- Name: nutrition_log; Type: TABLE; Schema: public; Owner: tylergrass
--

CREATE TABLE public.nutrition_log (
    id integer NOT NULL,
    journal_entry_id integer NOT NULL,
    water_intake integer DEFAULT 0 NOT NULL,
    CONSTRAINT water_intake_non_negative CHECK ((water_intake >= 0))
);


ALTER TABLE public.nutrition_log OWNER TO tylergrass;

--
-- Name: nutrition_log_id_seq; Type: SEQUENCE; Schema: public; Owner: tylergrass
--

CREATE SEQUENCE public.nutrition_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.nutrition_log_id_seq OWNER TO tylergrass;

--
-- Name: nutrition_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tylergrass
--

ALTER SEQUENCE public.nutrition_log_id_seq OWNED BY public.nutrition_log.id;


--
-- Name: nutrition_log_nutrient_target; Type: TABLE; Schema: public; Owner: tylergrass
--

CREATE TABLE public.nutrition_log_nutrient_target (
    nutrition_log_id integer NOT NULL,
    nutrient_id integer NOT NULL,
    amount integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.nutrition_log_nutrient_target OWNER TO tylergrass;

--
-- Name: user_nutrient_target; Type: TABLE; Schema: public; Owner: tylergrass
--

CREATE TABLE public.user_nutrient_target (
    user_id uuid NOT NULL,
    nutrient_id integer NOT NULL,
    amount integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.user_nutrient_target OWNER TO tylergrass;

--
-- Name: user_session; Type: TABLE; Schema: public; Owner: tylergrass
--

CREATE TABLE public.user_session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.user_session OWNER TO tylergrass;

--
-- Name: users; Type: TABLE; Schema: public; Owner: tylergrass
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    username character varying(24) NOT NULL,
    email character varying(254) NOT NULL,
    password character varying(60) NOT NULL,
    first_name character varying(32),
    last_name character varying(32),
    CONSTRAINT username_min_length CHECK ((char_length((username)::text) > 2))
);


ALTER TABLE public.users OWNER TO tylergrass;

--
-- Name: food id; Type: DEFAULT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.food ALTER COLUMN id SET DEFAULT nextval('public.food_id_seq'::regclass);


--
-- Name: journal_entry id; Type: DEFAULT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.journal_entry ALTER COLUMN id SET DEFAULT nextval('public.journal_entry_id_seq'::regclass);


--
-- Name: log_food id; Type: DEFAULT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.log_food ALTER COLUMN id SET DEFAULT nextval('public.log_food_id_seq'::regclass);


--
-- Name: log_meal_occasion id; Type: DEFAULT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.log_meal_occasion ALTER COLUMN id SET DEFAULT nextval('public.log_meal_occasion_id_seq'::regclass);


--
-- Name: nutrient_info id; Type: DEFAULT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.nutrient_info ALTER COLUMN id SET DEFAULT nextval('public.nutrient_info_id_seq'::regclass);


--
-- Name: nutrition_log id; Type: DEFAULT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.nutrition_log ALTER COLUMN id SET DEFAULT nextval('public.nutrition_log_id_seq'::regclass);


--
-- Data for Name: food; Type: TABLE DATA; Schema: public; Owner: tylergrass
--

COPY public.food (id, name) FROM stdin;
\.


--
-- Data for Name: food_nutrient_amount; Type: TABLE DATA; Schema: public; Owner: tylergrass
--

COPY public.food_nutrient_amount (food_id, nutrient_info_id, amount) FROM stdin;
\.


--
-- Data for Name: journal_entry; Type: TABLE DATA; Schema: public; Owner: tylergrass
--

COPY public.journal_entry (id, user_id, entry_date) FROM stdin;
\.


--
-- Data for Name: log_food; Type: TABLE DATA; Schema: public; Owner: tylergrass
--

COPY public.log_food (id, log_meal_occasion_id, food_id, servings) FROM stdin;
\.


--
-- Data for Name: log_meal_occasion; Type: TABLE DATA; Schema: public; Owner: tylergrass
--

COPY public.log_meal_occasion (id, occasion_name, nutrition_log_id) FROM stdin;
\.


--
-- Data for Name: nutrient_info; Type: TABLE DATA; Schema: public; Owner: tylergrass
--

COPY public.nutrient_info (id, name, unit) FROM stdin;
1	Energy	kCal
2	Total Carbohydrates	g
3	Total Fat	g
4	Protein	g
5	Fiber	g
6	Sugars	g
7	Trans Fat	g
8	Saturated Fat	g
9	Polyunsaturated Fat	g
10	Monounsaturated Fat	g
11	Sodium	mg
12	Cholesterol	mg
13	Calcium	mg
14	Iron	mg
15	Magnesium	mg
16	Potassium	mg
17	Zinc	mg
18	Phospohrus	mg
19	Vitamin A	mcg
20	Vitamin C	mg
21	Vitamin D	mcg
22	Vitamin E	mg
23	Vitamin K	mcg
24	Vitamin B5	mg
25	Vitamin B6	mg
26	Vitamin B12	mcg
27	Thiamin	mg
28	Riboflavin	mg
29	Niacin	mg
30	Biotin	mcg
31	Folate	mcg
\.


--
-- Data for Name: nutrition_log; Type: TABLE DATA; Schema: public; Owner: tylergrass
--

COPY public.nutrition_log (id, journal_entry_id, water_intake) FROM stdin;
\.


--
-- Data for Name: nutrition_log_nutrient_target; Type: TABLE DATA; Schema: public; Owner: tylergrass
--

COPY public.nutrition_log_nutrient_target (nutrition_log_id, nutrient_id, amount) FROM stdin;
\.


--
-- Data for Name: user_nutrient_target; Type: TABLE DATA; Schema: public; Owner: tylergrass
--

COPY public.user_nutrient_target (user_id, nutrient_id, amount) FROM stdin;
\.


--
-- Data for Name: user_session; Type: TABLE DATA; Schema: public; Owner: tylergrass
--

COPY public.user_session (sid, sess, expire) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: tylergrass
--

COPY public.users (id, created_at, username, email, password, first_name, last_name) FROM stdin;
\.


--
-- Name: food_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tylergrass
--

SELECT pg_catalog.setval('public.food_id_seq', 1, false);


--
-- Name: journal_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tylergrass
--

SELECT pg_catalog.setval('public.journal_entry_id_seq', 1, false);


--
-- Name: log_food_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tylergrass
--

SELECT pg_catalog.setval('public.log_food_id_seq', 1, false);


--
-- Name: log_meal_occasion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tylergrass
--

SELECT pg_catalog.setval('public.log_meal_occasion_id_seq', 1, false);


--
-- Name: nutrient_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tylergrass
--

SELECT pg_catalog.setval('public.nutrient_info_id_seq', 31, true);


--
-- Name: nutrition_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tylergrass
--

SELECT pg_catalog.setval('public.nutrition_log_id_seq', 1, false);


--
-- Name: food_nutrient_amount food_nutrient_amount_pkey; Type: CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.food_nutrient_amount
    ADD CONSTRAINT food_nutrient_amount_pkey PRIMARY KEY (food_id, nutrient_info_id);


--
-- Name: food food_pkey; Type: CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.food
    ADD CONSTRAINT food_pkey PRIMARY KEY (id);


--
-- Name: journal_entry journal_entry_pkey; Type: CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.journal_entry
    ADD CONSTRAINT journal_entry_pkey PRIMARY KEY (id);


--
-- Name: journal_entry journal_entry_user_id_entry_date_key; Type: CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.journal_entry
    ADD CONSTRAINT journal_entry_user_id_entry_date_key UNIQUE (user_id, entry_date);


--
-- Name: log_food log_food_pkey; Type: CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.log_food
    ADD CONSTRAINT log_food_pkey PRIMARY KEY (id);


--
-- Name: log_meal_occasion log_meal_occasion_pkey; Type: CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.log_meal_occasion
    ADD CONSTRAINT log_meal_occasion_pkey PRIMARY KEY (id);


--
-- Name: nutrient_info nutrient_info_name_key; Type: CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.nutrient_info
    ADD CONSTRAINT nutrient_info_name_key UNIQUE (name);


--
-- Name: nutrient_info nutrient_info_pkey; Type: CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.nutrient_info
    ADD CONSTRAINT nutrient_info_pkey PRIMARY KEY (id);


--
-- Name: nutrition_log_nutrient_target nutrition_log_nutrient_target_pkey; Type: CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.nutrition_log_nutrient_target
    ADD CONSTRAINT nutrition_log_nutrient_target_pkey PRIMARY KEY (nutrition_log_id, nutrient_id);


--
-- Name: nutrition_log nutrition_log_pkey; Type: CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.nutrition_log
    ADD CONSTRAINT nutrition_log_pkey PRIMARY KEY (id);


--
-- Name: user_session session_pkey; Type: CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.user_session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: nutrition_log set; Type: CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.nutrition_log
    ADD CONSTRAINT set UNIQUE (journal_entry_id);


--
-- Name: user_nutrient_target user_nutrient_target_pkey; Type: CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.user_nutrient_target
    ADD CONSTRAINT user_nutrient_target_pkey PRIMARY KEY (user_id, nutrient_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: tylergrass
--

CREATE INDEX "IDX_session_expire" ON public.user_session USING btree (expire);


--
-- Name: log_food fk_food; Type: FK CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.log_food
    ADD CONSTRAINT fk_food FOREIGN KEY (food_id) REFERENCES public.food(id) ON DELETE CASCADE;


--
-- Name: food_nutrient_amount fk_food; Type: FK CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.food_nutrient_amount
    ADD CONSTRAINT fk_food FOREIGN KEY (food_id) REFERENCES public.food(id) ON DELETE CASCADE;


--
-- Name: nutrition_log fk_journal_entry; Type: FK CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.nutrition_log
    ADD CONSTRAINT fk_journal_entry FOREIGN KEY (journal_entry_id) REFERENCES public.journal_entry(id) ON DELETE CASCADE;


--
-- Name: log_food fk_log_meal_occasion; Type: FK CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.log_food
    ADD CONSTRAINT fk_log_meal_occasion FOREIGN KEY (log_meal_occasion_id) REFERENCES public.log_meal_occasion(id) ON DELETE CASCADE;


--
-- Name: user_nutrient_target fk_nutrient; Type: FK CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.user_nutrient_target
    ADD CONSTRAINT fk_nutrient FOREIGN KEY (nutrient_id) REFERENCES public.nutrient_info(id) ON DELETE CASCADE;


--
-- Name: nutrition_log_nutrient_target fk_nutrient; Type: FK CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.nutrition_log_nutrient_target
    ADD CONSTRAINT fk_nutrient FOREIGN KEY (nutrient_id) REFERENCES public.nutrient_info(id) ON DELETE CASCADE;


--
-- Name: food_nutrient_amount fk_nutrient_info; Type: FK CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.food_nutrient_amount
    ADD CONSTRAINT fk_nutrient_info FOREIGN KEY (nutrient_info_id) REFERENCES public.nutrient_info(id) ON DELETE CASCADE;


--
-- Name: nutrition_log_nutrient_target fk_nutrition_log; Type: FK CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.nutrition_log_nutrient_target
    ADD CONSTRAINT fk_nutrition_log FOREIGN KEY (nutrition_log_id) REFERENCES public.nutrition_log(id) ON DELETE CASCADE;


--
-- Name: log_meal_occasion fk_nutrition_log; Type: FK CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.log_meal_occasion
    ADD CONSTRAINT fk_nutrition_log FOREIGN KEY (nutrition_log_id) REFERENCES public.nutrition_log(id) ON DELETE CASCADE;


--
-- Name: user_nutrient_target fk_user; Type: FK CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.user_nutrient_target
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: journal_entry fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: tylergrass
--

ALTER TABLE ONLY public.journal_entry
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: tylergrass
--

GRANT ALL ON SCHEMA public TO PUBLIC;
GRANT ALL ON SCHEMA public TO postgres;


--
-- PostgreSQL database dump complete
--

