CREATE TABLE Patient (

pno int,
pname varchar(30),
hospital varchar(30),
docName varchar (30),

PRIMARY KEY (pno)

);

CREATE TABLE Medication (
medName varchar(30),
dosage varchar(30),
reason varchar(30),
refillNum int,
refillDate DATE,
quantity varchar(30),
specialInstructions varchar(50),
pno int,

PRIMARY KEY (medName),
FOREIGN KEY (pno) REFERENCES Patient(pno)    

);

CREATE TABLE Prescription (

dateIssued DATE,
medName varchar(30),
pName varchar(30),
prescNo  int,

PRIMARY KEY (prescNo),
FOREIGN KEY (medName) REFERENCES Medication(medName)
)
