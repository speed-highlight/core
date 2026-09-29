      *****************************************************************
      * PAYROLL EXTRACT - MONTHLY NET PAY LISTING
      * TODO MOVE THE TAX RATE INTO A COPYBOOK, DON'T PERFORM IT HERE
       IDENTIFICATION DIVISION.
       PROGRAM-ID. PAYRUN.
       AUTHOR. M-DUPONT.
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT EMP-FILE ASSIGN TO "EMPLOYEE.DAT"
               ORGANIZATION IS SEQUENTIAL
               FILE STATUS  IS WS-FILE-STATUS.
      /
       DATA DIVISION.
       FILE SECTION.
       FD  EMP-FILE.
       01  EMP-RECORD.
           05  EMP-ID              PIC 9(6).
           05  EMP-NAME            PICTURE X(30).
           05  EMP-GROSS           PIC S9(7)V99 COMP-3.
       WORKING-STORAGE SECTION.
       01  WS-FLAGS.
           05  WS-FILE-STATUS      PIC XX       VALUE "00".
           05  WS-EOF-FLAG         PIC X        VALUE 'N'.
               88  WS-END-OF-FILE               VALUE 'Y'.
       01  WS-WORK-AREAS.
           05  WS-READ-COUNT       PIC 9(5)     VALUE ZERO.
           05  WS-NET-PAY          PIC S9(7)V99 VALUE +0.00.
           05  WS-TAX-RATE         PIC V9(4)    VALUE 0.1750.
           05  WS-EDIT-NAME        PIC X(20)    VALUE SPACES.
           05  WS-EDIT-PAY         PIC ZZ,ZZ9.99-.
       PROCEDURE DIVISION.
       0000-MAIN-CONTROL.
           PERFORM 1000-INITIALIZE
           PERFORM UNTIL WS-END-OF-FILE
               PERFORM 2000-PROCESS-EMPLOYEE
           END-PERFORM
           CLOSE EMP-FILE
           DISPLAY "RECORDS READ: " WS-READ-COUNT
           STOP RUN.
      *
       1000-INITIALIZE.
           OPEN INPUT EMP-FILE
           IF WS-FILE-STATUS NOT = "00"
               DISPLAY "OPEN FAILED, STATUS *> " WS-FILE-STATUS
               MOVE 16 TO RETURN-CODE
               GOBACK
           END-IF.
       2000-PROCESS-EMPLOYEE.
           READ EMP-FILE
               AT END
                   SET WS-END-OF-FILE TO TRUE
               NOT AT END
                   ADD 1 TO WS-READ-COUNT
                   COMPUTE WS-NET-PAY ROUNDED =
                       EMP-GROSS * (1 - WS-TAX-RATE)
                   MOVE EMP-NAME(1:20) TO WS-EDIT-NAME
                   MOVE WS-NET-PAY TO WS-EDIT-PAY
                   DISPLAY WS-EDIT-NAME WS-EDIT-PAY  *> FIXME ALIGN
           END-READ.
