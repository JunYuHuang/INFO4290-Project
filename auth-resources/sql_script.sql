--
-- PostgreSQL database dump
--
-- Dumped from database version 13.1
-- Dumped by pg_dump version 13.1
-- Started on 2021-03-11 20:47:31
-- DROP DATABASE guessmysketch;
CREATE DATABASE guessmysketch WITH OWNER = postgres ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252' TABLESPACE = pg_default CONNECTION
LIMIT
    = -1;

SET
    statement_timeout = 0;

SET
    lock_timeout = 0;

SET
    idle_in_transaction_session_timeout = 0;

SET
    client_encoding = 'UTF8';

SET
    standard_conforming_strings = on;

SELECT
    pg_catalog.set_config('search_path', '', false);

SET
    check_function_bodies = false;

SET
    xmloption = content;

SET
    client_min_messages = warning;

SET
    row_security = off;

SET
    default_tablespace = '';

SET
    default_table_access_method = heap;

--
-- TOC entry 201 (class 1259 OID 16525)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.users (
    id bigint NOT NULL,
    username text NOT NULL,
    password text NOT NULL
);

ALTER TABLE
    public.users OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 16523)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.users_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER TABLE
    public.users_id_seq OWNER TO postgres;

--
-- TOC entry 2987 (class 0 OID 0)
-- Dependencies: 200
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

--
-- TOC entry 2851 (class 2604 OID 16528)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.users
ALTER COLUMN
    id
SET
    DEFAULT nextval('public.users_id_seq' :: regclass);

-- Completed on 2021-03-11 20:47:31
--
-- PostgreSQL database dump complete
--